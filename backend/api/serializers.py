from rest_framework import serializers

from api.models import User, Transaction


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    name = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["name"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class TransactionSerializer(serializers.ModelSerializer):
    amount = serializers.IntegerField()

    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["id", "createdAt", "updatedAt"]
