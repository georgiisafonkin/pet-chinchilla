from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth_app.models import Breeder


class BreederMeViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Breeder.objects.create_user(
            username='testbreeder',
            password='testpass123',
            bio='Test bio',
        )
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testbreeder',
            'password': 'testpass123',
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_get_me_success(self):
        response = self.client.get(reverse('breeder_me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testbreeder')
        self.assertEqual(response.data['bio'], 'Test bio')

    def test_get_me_unauthorized(self):
        self.client.credentials()
        response = self.client.get(reverse('breeder_me'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_me_success(self):
        response = self.client.patch(reverse('breeder_me'), {
            'bio': 'Updated bio',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], 'Updated bio')

    def test_patch_me_username_is_readonly(self):
        response = self.client.patch(reverse('breeder_me'), {
            'username': 'hacked',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testbreeder')


class BreederListViewTests(TestCase):
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

    def test_list_excludes_current_user(self):
        response = self.client.get(reverse('breeder_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [b['username'] for b in response.data]
        self.assertNotIn('testbreeder', usernames)
        self.assertIn('otherbreeder', usernames)

    def test_list_unauthorized(self):
        self.client.credentials()
        response = self.client.get(reverse('breeder_list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)