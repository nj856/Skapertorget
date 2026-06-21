from rest_framework import serializers
from .models import HelpTicket

class HelpTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpTicket
        fields = [
            'id', 'user', 'title', 'message', 'email',
            'status', 'priority', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
    
    def validate_title(self, value):
        """Valider at tittelen ikke er tom eller for kort"""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Tittelen må være minst 3 tegn.")
        if len(value) > 200:
            raise serializers.ValidationError("Tittelen kan ikke være lengre enn 200 tegn.")
        return value.strip()
    
    def validate_message(self, value):
        """Valider at meldingen ikke er tom"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Meldingen må være minst 10 tegn")
        return value.strip()
    
    def validate_email(self, value):
        """Valider e-post format (valgfritt felt)"""
        if value and '@' not in value:
            raise serializers.ValidationError("Ugyldig e-postadresse")
        return value
    
    def validate(self, data):
        """Valider at enten user eller email er til stede"""
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        
        if not user and not data.get('email'):
            raise serializers.ValidationError({
                'email': 'E-post er påkrevd når du ikke er logget inn'
            })
        return data