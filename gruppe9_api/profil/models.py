from django.db import models

class Profil(models.Model):
    ROLLE_VALG = [
        ('kunde', 'Kunde'),
        ('selger', 'Selger'),
        ('begge', 'Begge deler'),
    ]
    navn = models.CharField(max_length=255)
    epost = models.EmailField(unique=True)
    beskrivelse = models.TextField(blank=True)
    rolle = models.CharField(max_length=10, choices=ROLLE_VALG)
    opprettet = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.navn
