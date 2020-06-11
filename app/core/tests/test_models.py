from django.test import TestCase
from django.contrib.auth import get_user_model


class ModelTests(TestCase):

    def test_create_user_successfull(self):
        email = 'hp@gmail.com'
        password = 'hp'
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )

        self.assertEquals(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_email_lower(self):
        email = 'hp1@GMAIL.com'
        user = get_user_model().objects.create_user(
            email=email
        )

        self.assertEquals(user.email, email.lower())

    def test_email_validity(self):
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                None, 'test123'
            )

    def test_create_superuser(self):
        email = 'test@gmail.com'
        password = 'test123'

        user = get_user_model().objects.create_superuser(
            email=email,
            password=password
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
