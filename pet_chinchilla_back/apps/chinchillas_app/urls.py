from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChinchillaViewSet

router = DefaultRouter()
router.register(r'chinchillas', ChinchillaViewSet, basename='chinchilla')

urlpatterns = [
    path('', include(router.urls)),
]