from django.db import models


class Post(models.Model):
    CATEGORY_CHOICES = [
        ('learning', 'Learning Journey'),
        ('questions', 'Questions'),
        ('community', 'Community'),
    ]

    author = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    video = models.FileField(
        upload_to='community/posts/videos/',
        blank=True,
        null=True
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='community'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author} - {self.category}'
    
class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    video = models.FileField(
        upload_to='community/comments/videos/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.author} - Comment on post {self.post.id}'
class Like(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'author')

    def __str__(self):
        return f'{self.author} liked post {self.post.id}'