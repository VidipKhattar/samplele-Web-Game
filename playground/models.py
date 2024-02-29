from django.db import models


class SamplerSong(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    artwork = models.URLField()
    audio = models.URLField()
    year = models.IntegerField()
    clue_1 = models.TextField()
    clue_2 = models.TextField()
    clue_3 = models.TextField()

    def __str__(self):
        return self.title


class SampledSong(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    artwork = models.URLField()
    audio = models.URLField()
    year = models.IntegerField()

    def __str__(self):
        return self.title
