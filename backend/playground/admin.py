from django.contrib import admin
from .models import SongPost


class SongPostAdmin(admin.ModelAdmin):
    list_display = (
        "sampler_title",
        "sampled_title",
        "sampler_album",
        "sampled_album",
        "sampler_artist",
        "sampled_artist",
        "sampler_year",
        "sampled_year",
        "post_date",
    )
    list_filter = (
        "sampler_artist",
        "sampled_artist",
        "post_date",
    )
    search_fields = (
        "sampler_title",
        "sampled_title",
    )


admin.site.register(SongPost, SongPostAdmin)
