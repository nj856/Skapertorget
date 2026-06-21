from django.db import models

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ("genser", "Genser"),
        ("sokker", "Sokker"),
        ("bukse", "Bukse"),
        ("topper", "Topper"),
        ("kjoler", "Kjoler"),
        ("sko", "Sko"),
    ]

    name      = models.CharField(max_length=100)
    category  = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    size      = models.CharField(max_length=10)
    price     = models.DecimalField(max_digits=8, decimal_places=2)
    stock     = models.IntegerField(default=0)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name
