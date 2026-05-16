from rest_framework import generics, permissions
from apps.auth_app.models import Breeder
from .serializers import *

class BreederListView(generics.ListAPIView):
    """List of all breeders except current user."""
    serializer_class = BreederSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Breeder.objects.exclude(pk=self.request.user.pk).order_by('username')
    
class BreederMeView(generics.RetrieveUpdateAPIView):
    serializer_class = BreederMeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ('get', 'patch')

    def get_object(self):
        return self.request.user