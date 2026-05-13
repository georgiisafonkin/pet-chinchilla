from rest_framework import serializers
from apps.auth_app.models import Breeder


class BreederSerializer(serializers.ModelSerializer):
    """Public breeder profile - for the breeders list."""
    class Meta:
        model = Breeder
        fields = ('id', 'username', 'bio')
        read_only_fields = ('id', 'username')

class BreederMeSerializer(serializers.ModelSerializer):
    """Full profile for the current authenticated breeder."""
    class Meta:
        model = Breeder
        fields = ('id', 'username', 'email', 'bio')
        read_only_fields = ('id', 'username')