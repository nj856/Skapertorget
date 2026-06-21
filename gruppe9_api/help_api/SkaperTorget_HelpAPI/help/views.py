from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import NotFound, ValidationError
from django.shortcuts import get_object_or_404
from .models import HelpTicket
from .serializers import HelpTicketSerializer

class HelpTicketListCreateView(generics.ListCreateAPIView):
    """
    GET: Hent alle hjelpeforespørsler (admin kan se alle, brukere ser sine egne)
    POST: Opprett ny hjelpeforespørsel
    """
    serializer_class = HelpTicketSerializer
    permission_classes = []
    
    def get_queryset(self):
        """Returner queryset basert på brukerens rolle"""
        user = self.request.user
        
        if user.is_staff or user.is_superuser:
            
            return HelpTicket.objects.all()
        elif user.is_authenticated:
            
            return HelpTicket.objects.filter(user=user)
        else:
            
            return HelpTicket.objects.none()
    
    def perform_create(self, serializer):
        """Lag ny ticket med automatisk tilknytning til innlogget bruker"""
        user = self.request.user if self.request.user.is_authenticated else None
        
        
        email = self.request.data.get('email')
        
        if not user and not email:
            raise ValidationError({
                'detail': 'Du må enten være logget inn eller oppgi e-postadresse'
            })
        
        serializer.save(user=user)

class HelpTicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Hent spesifikk hjelpeforespørsel
    PUT/PATCH: Oppdater hjelpeforespørsel
    DELETE: Slett hjelpeforespørsel
    """
    serializer_class = HelpTicketSerializer
    permission_classes = []
    
    def get_queryset(self):
        """Begrens tilgang basert på brukerrolle"""
        user = self.request.user
        
        if user.is_staff or user.is_superuser:
            return HelpTicket.objects.all()
        elif user.is_authenticated:
            return HelpTicket.objects.filter(user=user)
        return HelpTicket.objects.none()
    
    def get_object(self):
        """Hent objekt med feilhåndtering"""
        queryset = self.get_queryset()
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        
        try:
            obj = get_object_or_404(queryset, **{self.lookup_field: self.kwargs[lookup_url_kwarg]})
        except (NotFound, ValueError):
            raise NotFound(detail="Hjelpeforespørsel ikke funnet")
        
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_update(self, serializer):
        """Oppdater ticket (kun admin kan endre status/priority)"""
        user = self.request.user
        
        if not user.is_staff and ('status' in self.request.data or 'priority' in self.request.data):
            raise ValidationError({
                'detail': 'Bare administratorer kan endre status og prioritet'
            })
        
        serializer.save()
    
    def perform_destroy(self, serializer):
        """Slett ticket (kun admin eller ticket-eier)"""
        ticket = self.get_object()
        
        if not self.request.user.is_staff and ticket.user != self.request.user:
            raise ValidationError({
                'detail': 'Du har ikke tillatelse til å slette denne forespørselen'
            })
        
        ticket.delete()