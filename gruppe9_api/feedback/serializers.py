from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'hvem_er_du', 'bestilling', 'produkt', 'vurdering', 'melding']
