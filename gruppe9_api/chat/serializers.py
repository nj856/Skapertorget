from rest_framework import serializers
from .models import Chat, Melding

class MeldingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Melding
        fields = ['id', 'chat', 'avsender_id', 'tekst', 'opprettet_tid']

class ChatSerializer(serializers.ModelSerializer):
    meldinger = MeldingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Chat
        fields = ['id', 'kunde_id', 'selger_id', 'produkt_id', 'meldinger']