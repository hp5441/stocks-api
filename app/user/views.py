import requests
import json

from django.shortcuts import redirect
from django.contrib.auth import get_user_model, authenticate, login
from django.http import JsonResponse

from rest_framework import generics, authentication, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

from user.serializers import UserSerializer, AuthTokenSerializer, SocialUserSerializer

CLIENT_ID = '455912657305-qf9hdslu6r8fhlssiku16mptuasmjedb.apps.googleusercontent.com'
# Read from a file or environmental variable in a real app
CLIENT_SECRET = '249PgOiOPWrd_fUJy_K9Rp7_'
SCOPE = 'https://www.googleapis.com/auth/userinfo.email'
REDIRECT_URI = 'http://localhost:8000/api/user/oauth2callback/'


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for the user"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class GoogleView(APIView):

    def get(self, request, format=None):
        if 'credentials' not in request.session:
            return redirect('/api/user/oauth2callback/')
        credentials = json.loads(request.session['credentials'])
        if credentials['expires_in'] <= 0:
            return redirect('/api/user/oauth2callback/')
        else:
            headers = {'Authorization': 'Bearer {}'.format(
                credentials['access_token'])}
            req_uri = 'https://www.googleapis.com/oauth2/v1/userinfo'
            r = requests.get(req_uri, headers=headers)
            userinfo = json.loads(r.text)
            user = None
            try:
                user = get_user_model().objects.get(email=userinfo['email'])
            except:
                pass
            if user:
                login(request, user)
            else:
                user = get_user_model().objects.create_social_user(
                    email=userinfo['email'])
                login(request, user)
            print(user)
            return Response(UserSerializer(user).data)

    def post(self, request, format=None):
        access_token = json.loads(request.body).get('access_token')
        headers = {'Authorization': 'Bearer {}'.format(access_token)}
        req_uri = 'https://www.googleapis.com/oauth2/v1/userinfo'
        r = requests.get(req_uri, headers=headers)
        userinfo = json.loads(r.text)
        user = None
        try:
            user = get_user_model().objects.get(email=userinfo['email'])
        except:
            pass
        if user:
            print('just logging in')
            login(request, user)
        else:
            print('creating new user')
            user = get_user_model().objects.create_social_user(
                email=userinfo['email'], name=userinfo['name'])
            login(request, user)
        print(user)
        return Response(UserSerializer(user).data)


class NormalLogin(APIView):

    def post(self, request, format=None):

        login_details = json.loads(request.body)
        print(login_details)
        user = authenticate(
            request,
            username=login_details['email'],
            password=login_details['password']
        )
        if not user:
            msg = 'Unable to authenticate with provided credentials'
            raise serializers.ValidationError(msg, code='authorization')
        else:
            login(request, user)
        return Response(UserSerializer(user).data)


def oauth2callback(request):
    if 'code' not in request.GET.keys():
        auth_uri = ('https://accounts.google.com/o/oauth2/v2/auth?response_type=code'
                    '&client_id={}&redirect_uri={}&scope={}').format(CLIENT_ID, REDIRECT_URI, SCOPE)
        #print(request, request.headers)
        return redirect(auth_uri)
    else:
        #print(request, request.headers)
        auth_code = request.GET.get('code')
        data = {'code': auth_code,
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'redirect_uri': REDIRECT_URI,
                'grant_type': 'authorization_code'}
        r = requests.post('https://oauth2.googleapis.com/token', data=data)
        request.session['credentials'] = r.text
        print(request.session['credentials'])
        return redirect('/api/user/google/')
