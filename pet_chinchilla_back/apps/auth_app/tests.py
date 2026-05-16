from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.auth_app.models import Breeder


class RegisterViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('register')
        self.valid_data = {
            'username': 'testbreeder',
            'password': 'testpass123',
            'password2': 'testpass123',
            'bio': 'Test bio',
        }

    def test_register_success(self):
        response = self.client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Breeder.objects.filter(username='testbreeder').exists())

    def test_register_passwords_do_not_match(self):
        data = {**self.valid_data, 'password2': 'wrongpass'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_username(self):
        data = {**self.valid_data, 'username': ''}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_username(self):
        self.client.post(self.url, self.valid_data)
        response = self.client.post(self.url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('token_obtain_pair')
        self.user = Breeder.objects.create_user(
            username='testbreeder',
            password='testpass123',
        )

    def test_token_success(self):
        response = self.client.post(self.url, {
            'username': 'testbreeder',
            'password': 'testpass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_wrong_password(self):
        response = self.client.post(self.url, {
            'username': 'testbreeder',
            'password': 'wrongpass',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_contains_username(self):
        response = self.client.post(self.url, {
            'username': 'testbreeder',
            'password': 'testpass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class TokenRefreshViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Breeder.objects.create_user(
            username='testbreeder',
            password='testpass123',
        )
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testbreeder',
            'password': 'testpass123',
        })
        self.refresh_token = response.data['refresh']

    def test_refresh_success(self):
        response = self.client.post(reverse('token_refresh'), {
            'refresh': self.refresh_token,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_refresh_invalid_token(self):
        response = self.client.post(reverse('token_refresh'), {
            'refresh': 'invalidtoken',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)