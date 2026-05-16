import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')

        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        self.user = user
        self.recipient_id = int(self.scope['url_route']['kwargs']['recipient_id'])
        self.room_name = Message.get_room_name(self.user.id, self.recipient_id)
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        await self.mark_messages_read()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format.')
            return

        text = data.get('text', '').strip()
        if not text:
            await self.send_error('Message text is empty.')
            return

        message = await self.save_message(text)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'id': message.id,
                'text': message.text,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'recipient_id': self.recipient_id,
                'created_at': message.created_at.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat.message',
            'id': event['id'],
            'text': event['text'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'recipient_id': event['recipient_id'],
            'created_at': event['created_at'],
        }))

    async def send_error(self, message: str):
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': message,
        }))

    @database_sync_to_async
    def save_message(self, text: str) -> Message:
        return Message.objects.create(
            sender=self.user,
            recipient_id=self.recipient_id,
            text=text,
        )

    @database_sync_to_async
    def mark_messages_read(self):
        Message.objects.filter(
            sender_id=self.recipient_id,
            recipient=self.user,
            is_read=False,
        ).update(is_read=True)