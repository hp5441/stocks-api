# Generated by Django 3.0.13 on 2021-04-21 11:08

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stockpricedata',
            name='close_price',
        ),
        migrations.RemoveField(
            model_name='stockpricedata',
            name='date',
        ),
        migrations.RemoveField(
            model_name='stockpricedata',
            name='high',
        ),
        migrations.RemoveField(
            model_name='stockpricedata',
            name='low',
        ),
        migrations.RemoveField(
            model_name='stockpricedata',
            name='open_price',
        ),
        migrations.RemoveField(
            model_name='stockpricedata',
            name='volume',
        ),
        migrations.AddField(
            model_name='stockpricedata',
            name='price_data',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=0),
            preserve_default=False,
        ),
    ]
