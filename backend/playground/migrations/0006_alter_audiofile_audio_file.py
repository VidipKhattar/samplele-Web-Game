# Generated by Django 4.2 on 2024-05-09 07:53

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("playground", "0005_alter_audiofile_audio_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="audiofile",
            name="audio_file",
            field=models.FileField(upload_to=""),
        ),
    ]
