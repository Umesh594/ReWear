from rest_framework import serializers
from .models import FraudReport

class FraudReportSerializer(serializers.ModelSerializer):
    swap_id = serializers.IntegerField(source='swap.id')
    
    class Meta:
        model = FraudReport
        fields = ['id', 'swap_id', 'flagged_at', 'reviewed', 'score']
