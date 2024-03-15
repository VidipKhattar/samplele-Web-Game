from rest_framework import serializers
from .models import SongPost


class SongPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongPost
        fields = [
            "id",
            "sampler_title",
            "sampled_title",
            "sampler_artist",
            "sampled_artist",
            "sampler_artwork",
            "sampled_artwork",
            "sampler_audio",
            "sampled_audio",
            "sampler_year",
            "sampler_year",
            "sampled_year",
            "clue_1",
            "clue_2",
            "clue_3",
            "post_date",
        ]
