from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth_app.models import Breeder
from apps.chat_app.models import Message


class MessageHistoryViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Breeder.objects.create_user(
            username='testbreeder',
            password='testpass123',
        )
        self.other_user = Breeder.objects.create_user(
            username='otherbreeder',
            password='testpass123',
        )
        self.third_user = Breeder.objects.create_user(
            username='thirdbreeder',
            password='testpass123',
        )
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testbreeder',
            'password': 'testpass123',
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        Message.objects.create(
            sender=self.user,
            recipient=self.other_user,
            text='Hello from testbreeder',
        )
        Message.objects.create(
            sender=self.other_user,
            recipient=self.user,
            text='Hello back',
        )
        Message.objects.create(
            sender=self.third_user,
            recipient=self.user,
            text='Message from third user',
        )

    def test_history_returns_only_conversation_with_user(self):
        response = self.client.get(
            reverse('message_history'),
            {'with': self.other_user.id},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        texts = [m['text'] for m in response.data]
        self.assertIn('Hello from testbreeder', texts)
        self.assertIn('Hello back', texts)
        self.assertNotIn('Message from third user', texts)

    def test_history_ordered_by_created_at(self):
        response = self.client.get(
            reverse('message_history'),
            {'with': self.other_user.id},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['text'], 'Hello from testbreeder')
        self.assertEqual(response.data[1]['text'], 'Hello back')

    def test_history_missing_with_param(self):
        response = self.client.get(reverse('message_history'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_history_invalid_with_param(self):
        response = self.client.get(
            reverse('message_history'),
            {'with': 'invalid'},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_history_unauthorized(self):
        self.client.credentials()
        response = self.client.get(
            reverse('message_history'),
            {'with': self.other_user.id},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MessageModelTests(TestCase):
    def test_get_room_name_is_deterministic(self):
        self.assertEqual(
            Message.get_room_name(1, 2),
            Message.get_room_name(2, 1),
        )

    def test_get_room_name_format(self):
        self.assertEqual(Message.get_room_name(1, 2), 'chat_1_2')