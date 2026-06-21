

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hvem_er_du', models.CharField(max_length=100)),
                ('bestilling', models.CharField(max_length=100)),
                ('produkt', models.CharField(max_length=100)),
                ('vurdering', models.IntegerField()),
                ('melding', models.TextField()),
                ('opprettet', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
