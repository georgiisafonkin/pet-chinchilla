from django.db import models
from django.conf import settings


class Chinchilla(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chinchillas',
    )
    name = models.CharField(max_length=100)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    breed = models.CharField(max_length=100, blank=True)
    fur_type = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.owner.username})'