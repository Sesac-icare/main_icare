# Generated by Django 4.2.18 on 2025-02-12 03:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("registerPrescription", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pharmacyenvelope",
            name="prescription_number",
            field=models.CharField(max_length=50),
        ),
    ]
