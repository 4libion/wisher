from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.shortcuts import redirect

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
)

import requests


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.create(serializer.validated_data))


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    

class GoogleLoginView(APIView):
    def post(self, request):
        google_token = request.data.get('token')

        if not google_token:
            return Response({'detail': 'No token provided'}, status=400)
        
        userinfo_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {google_token}'}
        )

        if userinfo_response.status_code != 200:
            return Response({'detail': 'Failed to validate Google token'}, status=400)
        
        user_info = userinfo_response.json()
        email = user_info.get('email')
        name = user_info.get('name')
        picture = user_info.get('picture')

        if not email:
            return Response({'detail': 'No email returned from Google'}, status=400)
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': name.split(' ')[0],
                'last_name': ' '.join(name.split(' ')[1:]) if len(name.split(' ')) > 1 else ''
            }
        )

        refresh = RefreshToken.for_user(user)
        print(refresh.access_token)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': name,
                'avatar': picture,
            }
        })
