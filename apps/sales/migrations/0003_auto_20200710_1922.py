# Generated by Django 2.2.8 on 2020-07-10 19:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0002_auto_20200708_1249'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orderactivitylog',
            old_name='remark',
            new_name='remarks',
        ),
    ]