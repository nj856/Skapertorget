from django.db import models

class Chat(models.Model):
    kunde_id = models.IntegerField()
    selger_id = models.IntegerField()
    produkt_id = models.IntegerField(null=True, blank=True)
    opprettet_tid = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id}"

class Melding(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="meldinger")
    avsender_id = models.IntegerField(null=True, blank=True)
    tekst = models.TextField()
    opprettet_tid = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.tekst[:30]