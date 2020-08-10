# Generated by Django 2.2.8 on 2020-07-01 10:16

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('location_service', '0001_initial'),
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('dob', models.DateField(blank=True, null=True)),
                ('gender', models.IntegerField(blank=True, choices=[(1, 'Male'), (2, 'Female'), (3, 'Others')], null=True)),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='userprofile')),
                ('address', models.TextField(blank=True, null=True)),
                ('is_institute_admin', models.BooleanField(blank=True, default=False, null=True)),
                ('status', models.IntegerField(blank=True, choices=[(0, 'New'), (1, 'Not Contact Yet'), (2, 'Not Interested Now'), (3, 'Application on Process'), (4, 'Already Avail Loan'), (5, 'Already Avail Card'), (6, 'High DBR'), (7, 'CIB Problem'), (8, 'Incorrect Info'), (9, 'Phone Not Receive'), (10, 'Call Later'), (11, 'Already Contacted'), (12, 'Out of Range'), (13, 'Number Invalid'), (14, 'Low Income'), (15, 'Hand Cash Salary'), (16, 'Test'), (17, 'Not Now'), (18, 'Businessman'), (19, 'Land Lord')], null=True)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('call_time', models.DateTimeField(blank=True, null=True)),
                ('user_type', models.IntegerField(blank=True, choices=[(1, 'BCBD Member'), (2, 'Bank Member'), (3, 'Agent Member'), (4, 'Register Member'), (5, 'Applicant'), (6, 'Subscriber'), (7, 'Search Applicant')], null=True)),
                ('is_team_leader', models.BooleanField(default=False)),
                ('profession', models.IntegerField(blank=True, choices=[(1, 'Salaried'), (2, 'Businessman'), (3, 'Landlord'), (4, 'Professional'), (5, 'HouseWife'), (6, 'Student'), (7, 'Others')], null=True)),
                ('etin', models.BooleanField(default=False)),
                ('tnt', models.BooleanField(default=False)),
                ('security_cheque', models.BooleanField(default=False)),
                ('nid', models.BooleanField(default=False)),
                ('passport', models.BooleanField(default=False)),
                ('monthly_income', models.FloatField(blank=True, null=True)),
                ('profession_income_info', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('co_applicant_info', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('property_info', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('car_info', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('loan_type', models.IntegerField(blank=True, null=True)),
                ('takeover_topup_info', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('can_see_dashboard', models.BooleanField(default=False)),
                ('extension_no', models.CharField(blank=True, max_length=30, null=True)),
                ('speed', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Sales Person Speed km/h')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('division', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='division', to='location_service.Division')),
                ('location', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='upazila', to='location_service.Upazila')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('zone', models.ManyToManyField(blank=True, to='location_service.Zone')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserAvailability',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateField(verbose_name='From')),
                ('finish', models.DateField(verbose_name='To')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GroupProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('can_view_dashboard', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('name', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='auth.Group')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]