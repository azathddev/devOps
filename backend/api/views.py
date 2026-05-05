from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.db.models import Sum
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Transaction
from api.serializers import TransactionSerializer,RegisterSerializer, LoginSerializer


@api_view(["GET"])
def health_check(request):
    return Response(
        {
            'detail': 'ok'
        }
    )

@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token, created = Token.objects.get_or_create(user=user)
    return Response(
        {
                "accessToken": token.key,
                "user": {
                    "id": user.id,
                    "email": user.username,
                    "name": user.first_name
                }
        }, status=201
    )


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    user = authenticate(
        username=data['email'],
        password=data['password']
    )
    if not user:
        return Response({
          "message": "Credentials not provided",
          "code": "CREDENTIALS_NOT_PROVIDED",
          "errors": {
            "login": ["email or password doesn't correct"]
          }
        }, status=401)
    token, created = Token.objects.get_or_create(user=user)
    return Response(
        {
            "accessToken": token.key,
            "user": {
                "id": user.id,
                "email": user.username,
                "name": user.first_name
            }
        }, status=200
    )

@api_view(["GET"])
def me(request):
    if hasattr(request, "user") and hasattr(request.user, "first_name"):
        return Response(
            {
                "id": request.user.id,
                "email": request.user.username,
                "name": request.user.first_name
            }
        )
    return Response(
        {
            "message": "Not authenticated",
            "code": "NOT_AUTHENTICATED",
            "errors": {
                "login": ["authentication ne proiden"]
            }
        }, status=401
    )

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        raw_type = self.request.query_params.get("type")
        if raw_type:
            normalized_type = raw_type.strip().rstrip("/")
            queryset = queryset.filter(type=normalized_type)
        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        queryset = self.get_queryset()
        return Response(
            {
                "items": response.data,
                "summary": {
                    "incomeTotal": queryset.filter(type="income").aggregate(Sum("amount"))["amount__sum"],
                    "expenseTotal": queryset.filter(type="expense").aggregate(Sum("amount"))["amount__sum"],
                    "balance": queryset.aggregate(Sum("amount"))["amount__sum"],
                }
            }
        )

