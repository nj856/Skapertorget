from django.db import models

class Feedback(models.Model):
    hvem_er_du = models.CharField(max_length=100)
    bestilling  = models.CharField(max_length=100)
    produkt     = models.CharField(max_length=100)
    vurdering   = models.IntegerField()
    melding     = models.TextField()
    opprettet   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.hvem_er_du} - {self.vurdering}/5"
