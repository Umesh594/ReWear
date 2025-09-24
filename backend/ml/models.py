# backend/ml/models.py
from django.db import models
from users.models import SwapRequest

class FraudReport(models.Model):
    swap = models.ForeignKey(SwapRequest, on_delete=models.CASCADE)
    flagged_at = models.DateTimeField(auto_now_add=True)
    reviewed = models.BooleanField(default=False)
    score = models.FloatField(null=True, blank=True)  # optional anomaly score

    def __str__(self):
        return f"FraudReport for Swap {self.swap.id} - Reviewed: {self.reviewed}"
