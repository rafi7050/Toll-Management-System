# Generated by Django 2.2.8 on 2020-07-05 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_product_nutrition'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='unit',
            field=models.IntegerField(choices=[(1, 'KG'), (2, 'Bundle'), (3, 'Piece')], default=1),
        ),
    ]