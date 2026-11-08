from rest_framework import serializers
from .models import User


class ParentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "phone",
            "preferred_language",
        ]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username already exists."
            )
        return value

    def validate_phone(self, value):
        if value and User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "This phone number is already registered."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        return User.objects.create_user(
            password=password,
            role="PARENT",
            **validated_data
        )