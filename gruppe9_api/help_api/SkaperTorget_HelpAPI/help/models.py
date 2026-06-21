from django.db import models
from django.contrib.auth.models import User

class HelpTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Åpen'),
        ('in_progress', 'Under behandling'),
        ('resolved', 'Løst'),
        ('closed', 'Lukket'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Lav'),
        ('medium', 'Medium'),
        ('high', 'Høy'),
        ('urgent', 'Akutt'),
    ]
    
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='help_tickets'
    )
    
    
    title = models.CharField(max_length=200, verbose_name="Tittel")
    message = models.TextField(verbose_name="Melding")
    email = models.EmailField(verbose_name="E-post", null=True, blank=True)
    
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='open',
        verbose_name="Status"
    )
    priority = models.CharField(
        max_length=20, 
        choices=PRIORITY_CHOICES, 
        default='medium',
        verbose_name="Prioritet"
    )
    
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Opprettet")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Oppdatert")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Hjelpeforespørsel"
        verbose_name_plural = "Hjelpeforespørsler"
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"