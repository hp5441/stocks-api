# Generated by Django 3.0.8 on 2020-07-31 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockTable',
            fields=[
                ('scrip', models.CharField(max_length=50, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('isin', models.CharField(max_length=20)),
            ],
        ),
    ]
