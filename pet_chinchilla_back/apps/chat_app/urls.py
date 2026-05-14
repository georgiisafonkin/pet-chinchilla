from django.urls import path
from .views import MessageHistoryView

urlpatterns = [
    path('chat/messages/', MessageHistoryView.as_view(), name='message_history'),
]