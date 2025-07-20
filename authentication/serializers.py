from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password')

    def validate(self, data):
        print("VALIDATING REGISTER DATA:", data)
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data.get('email'),
            password=validated_data.get('password')
        )
        return user
    
    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            "user_id": instance.id,
            "email": instance.email,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        print(data.get('email'), data.get('password'))
        user = authenticate(email=data.get('email'), password=data.get('password'))
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        self.user = user
        return data
    
    def create(self, validate_data):
        refresh = RefreshToken.for_user(self.user)
        return {
            "user_id": self.user.id,
            "email": self.user.email,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, data):
        self.token = data.get('refresh')
        return data
    
    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except Exception:
            raise serializers.ValidationError("Token is invalid or expired")
