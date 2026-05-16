from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Message
from .serializers import MessageSerializer


class MessageHistoryView(generics.ListAPIView):
    """GET /api/chat/messages/?with=<user_id>"""
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        me = self.request.user
        with_user_id = self.request.query_params.get('with')

        if not with_user_id:
            raise ValidationError({'with': 'This parameter is required.'})

        try:
            with_user_id = int(with_user_id)
        except ValueError:
            raise ValidationError({'with': 'Must be an integer.'})

        return Message.objects.filter(
            Q(sender=me, recipient_id=with_user_id) |
            Q(sender_id=with_user_id, recipient=me)
        ).select_related('sender', 'recipient').order_by('created_at')