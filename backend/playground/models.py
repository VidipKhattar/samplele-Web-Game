from django.db import models


class SongPost(models.Model):
    id = models.AutoField(primary_key=True)
    sampler_title = models.CharField(max_length=900)
    sampled_title = models.CharField(max_length=900)
    sampler_album = models.CharField(max_length=900)
    sampled_album = models.CharField(max_length=900, blank=True)
    sampler_artist = models.CharField(max_length=900)
    sampled_artist = models.CharField(max_length=900, blank=True)
    sampler_artwork = models.URLField()
    sampled_artwork = models.URLField(blank=True)
    sampler_audio = models.CharField(max_length=900)
    sampler_audio_youtube_link = models.URLField(blank=True)
    sampler_audio_start_time = models.URLField(blank=True)
    sampled_audio = models.CharField(max_length=900)
    sampled_audio_youtube_link = models.URLField(blank=True)
    sampled_audio_start_time = models.URLField(blank=True)
    sampler_year = models.CharField()
    sampled_year = models.CharField(blank=True)
    post_date = models.DateField(unique=True)

    def __str__(self):
        return (
            f"{self.sampler_title} - {self.sampled_title}"  # Adjust this line as needed
        )
