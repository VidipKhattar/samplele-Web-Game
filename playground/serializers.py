from rest_framework import serializers
from .models import SamplerSong, SampledSong


class SamplerSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = SamplerSong
        fields = [
            "id",
            "title",
            "artist",
            "artwork",
            "audio",
            "year",
            "clue_1",
            "clue_2",
            "clue_3",
        ]


class SampledSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampledSong
        fields = ["id", "title", "artist", "artwork", "audio", "year"]
