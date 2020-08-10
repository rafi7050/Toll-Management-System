# Generated by Django 2.2.8 on 2020-07-03 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_auto_20200703_1000'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='unit',
            field=models.IntegerField(choices=[(1, 'KG'), (2, 'BUNDLE')], default=1),
        ),
    ]