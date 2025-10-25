from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from .models import Item,SwapRequest
class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
    def create(self, validated_data):
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        username = f"{first_name}{last_name}".replace(" ", "").lower()
        count = 1
        base_username = username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{count}"
            count += 1
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        return user 
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name']
class ItemSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(read_only=True)
    image = serializers.SerializerMethodField()  
    class Meta:
        model = Item
        fields = "__all__"
    def get_image(self, obj):
        if obj.image and str(obj.image).startswith("http"):
            return str(obj.image)
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url  
        return None
class SwapRequestSerializer(serializers.ModelSerializer):
    item_title = serializers.CharField(source='item.title', read_only=True)
    sender_name = serializers.CharField(source='sender.first_name', read_only=True)
    receiver_name = serializers.CharField(source='receiver.first_name', read_only=True)
    class Meta:
        model = SwapRequest
        fields = ['id', 'item', 'item_title', 'sender_name', 'receiver_name', 'status', 'created_at']