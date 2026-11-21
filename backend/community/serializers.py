from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from .models import Post, Comment, Like


ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'ogg']
MAX_VIDEO_SIZE_MB = 50


def validate_video_size(upload):
    # ponytail: checks extension + byte size only. Add content sniffing
    # (python-magic) only if spoofed uploads actually become a problem.
    if upload.size > MAX_VIDEO_SIZE_MB * 1024 * 1024:
        raise serializers.ValidationError(
            f'Video file too large (max {MAX_VIDEO_SIZE_MB} MB).'
        )


def video_field():
    return serializers.FileField(
        required=False,
        allow_null=True,
        validators=[
            FileExtensionValidator(ALLOWED_VIDEO_EXTENSIONS),
            validate_video_size,
        ],
    )


class PostSerializer(serializers.ModelSerializer):
    # Author is set from request.user in the view; exposed as the username.
    author = serializers.ReadOnlyField(source='author.username')
    video = video_field()

    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'content',
            'video',
            'category',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    video = video_field()

    class Meta:
        model = Comment
        fields = [
            'id',
            'post',
            'author',
            'content',
            'video',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class LikeSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Like
        fields = ['id', 'post', 'author', 'created_at']
        read_only_fields = ['id', 'created_at']
