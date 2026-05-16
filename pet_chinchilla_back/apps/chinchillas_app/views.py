from rest_framework import viewsets, permissions
from .models import Chinchilla
from .serializers import ChinchillaSerializer


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class ChinchillaViewSet(viewsets.ModelViewSet):
    serializer_class = ChinchillaSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Chinchilla.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)