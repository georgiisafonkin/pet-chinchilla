from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth_app.models import Breeder
from apps.chinchillas_app.models import Chinchilla


class ChinchillaViewSetTests(TestCase):
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
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testbreeder',
            'password': 'testpass123',
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.chinchilla = Chinchilla.objects.create(
            owner=self.user,
            name='Fluffy',
            age=12,
            breed='Standard',
            fur_type='Velvet',
            color='Grey',
        )
        self.other_chinchilla = Chinchilla.objects.create(
            owner=self.other_user,
            name='Other',
            age=6,
            breed='Standard',
            fur_type='Velvet',
            color='White',
        )

    def test_list_returns_only_own_chinchillas(self):
        response = self.client.get(reverse('chinchilla-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [c['name'] for c in response.data]
        self.assertIn('Fluffy', names)
        self.assertNotIn('Other', names)

    def test_create_chinchilla(self):
        response = self.client.post(reverse('chinchilla-list'), {
            'name': 'NewChinchilla',
            'age': 6,
            'breed': 'Standard',
            'fur_type': 'Angora',
            'color': 'White',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['owner'], 'testbreeder')

    def test_retrieve_own_chinchilla(self):
        response = self.client.get(reverse('chinchilla-detail', args=[self.chinchilla.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Fluffy')

    def test_retrieve_other_chinchilla_returns_404(self):
        response = self.client.get(reverse('chinchilla-detail', args=[self.other_chinchilla.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_own_chinchilla(self):
        response = self.client.patch(
            reverse('chinchilla-detail', args=[self.chinchilla.id]),
            {'name': 'Fluffy Updated', 'age': 13},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Fluffy Updated')
        self.assertEqual(response.data['age'], 13)

    def test_patch_other_chinchilla_returns_404(self):
        response = self.client.patch(
            reverse('chinchilla-detail', args=[self.other_chinchilla.id]),
            {'name': 'Hacked'},
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_own_chinchilla(self):
        response = self.client.delete(
            reverse('chinchilla-detail', args=[self.chinchilla.id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Chinchilla.objects.filter(id=self.chinchilla.id).exists())

    def test_delete_other_chinchilla_returns_404(self):
        response = self.client.delete(
            reverse('chinchilla-detail', args=[self.other_chinchilla.id])
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_returns_401(self):
        self.client.credentials()
        response = self.client.get(reverse('chinchilla-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)