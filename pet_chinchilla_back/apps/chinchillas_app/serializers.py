from rest_framework import serializers
from .models import Chinchilla


class ChinchillaSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Chinchilla
        fields = ('id', 'name', 'age', 'breed', 'fur_type', 'color', 'owner', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')