"""
ASGI config for pet_chinchilla_back project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pet_chinchilla_back.settings')

django_asgi_app = get_asgi_application()

from apps.chat_app.middleware import JWTAuthMiddlewareStack
from apps.chat_app import routing as chat_routing

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JWTAuthMiddlewareStack(
        URLRouter(chat_routing.websocket_urlpatterns)
    ),
})
