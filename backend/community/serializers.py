from rest_framework import serializers
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
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
        read_only_fields = [
            'id',
            'author',
            'created_at'
        ]

class CommentSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Like
        fields = ['id', 'post', 'author', 'created_at']
        read_only_fields = ['id', 'created_at']