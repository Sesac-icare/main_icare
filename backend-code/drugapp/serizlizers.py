from rest_framework import serializers
from .models import Drug

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = ['itemName', 'efcyQesitm', 'atpnQesitm', 'depositMethodQesitm']
