from django.urls import path

from . import views
from dj_rest_auth.views import LogoutView
app_name = 'user'

urlpatterns = [
    path('create/', views.CreateUserView.as_view(), name='create'),
    path('token/', views.CreateTokenView.as_view(), name='token'),
    path('me/', views.ManageUserView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('google/', views.GoogleView.as_view(), name='google'),
    path('login/', views.NormalLogin.as_view(), name='login'),
    path('oauth2callback/', views.oauth2callback, name='callback')
]
