from rest_framework import serializers
from .models import SongPost


class SongPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongPost
        fields = [
            "id",
            "sampler_title",
            "sampled_title",
            "sampled_album",
            "sampler_album",
            "sampler_artist",
            "sampled_artist",
            "sampler_artwork",
            "sampled_artwork",
            "sampler_audio",
            "sampled_audio",
            "sampler_year",
            "sampler_year",
            "sampled_year",
            "post_date",
        ]
