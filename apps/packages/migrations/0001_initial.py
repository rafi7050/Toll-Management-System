# Generated by Django 2.2.8 on 2020-07-03 11:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0004_product_unit'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Package',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.CharField(max_length=255)),
                ('nutrition_details', models.TextField()),
                ('discount_percentage', models.FloatField(default=0)),
                ('suggestion', models.IntegerField(default=10)),
                ('age_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.AgeGroup')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('nutrition_point', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.NutritionPoint')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PackageProduct',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit', models.FloatField(default=1)),
                ('price', models.FloatField(null=True)),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='packages.Package')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.Product')),
            ],
        ),
        migrations.AddField(
            model_name='package',
            name='products',
            field=models.ManyToManyField(through='packages.PackageProduct', to='products.Product'),
        ),
        migrations.AddField(
            model_name='package',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
    ]
