from django.urls import path

from api.views import health_check, login, register, me, TransactionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(r"transactions", TransactionViewSet, "transactions")

urlpatterns = [
    path("health-check/", health_check),
    path("auth/login", login),
    path("auth/register", register),
    path("auth/me", me),
] + router.urls
