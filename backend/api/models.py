import datetime
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.CharField(primary_key=True, default=uuid.uuid4)


class Transaction(models.Model):
    id = models.CharField(primary_key=True, default=uuid.uuid4)
    type = models.CharField(
        choices=(
            ("expense", "expense"),
            ("income", "income"),
        )
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=5)
    category = models.CharField(max_length=255)
    comment = models.TextField()
    occurredAt = models.DateTimeField()
    createdAt = models.DateTimeField(auto_now=True)
    updatedAt = models.DateTimeField(auto_now_add=True)
