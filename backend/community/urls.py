from django.urls import path
from .views import (
    post_list,
    comment_list,
    like_list,
    delete_post,
    delete_comment,
)

urlpatterns = [
    path('posts/', post_list, name='post-list'),

    path(
        'posts/<int:post_id>/comments/',
        comment_list,
        name='comment-list'
    ),

    path(
        'posts/<int:post_id>/likes/',
        like_list,
        name='like-list'
    ),

    path(
        'posts/<int:post_id>/delete/',
        delete_post,
        name='delete-post'
    ),

    path(
        'posts/<int:post_id>/comments/<int:comment_id>/delete/',
        delete_comment,
        name='delete-comment'
    ),
]