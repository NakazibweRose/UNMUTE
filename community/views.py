from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer



@api_view(['GET', 'POST'])
def post_list(request):

    # Anyone can view community posts (paginated: ?page=N)
    if request.method == 'GET':
        posts = Post.objects.all().order_by('-created_at')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # Only logged-in users can create posts
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Please log in to create a post.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Require either text or a video
    if not request.data.get('content') and not request.data.get('video'):
        return Response(
            {'error': 'Please write something or attach a video.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = PostSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET', 'POST'])
def comment_list(request, post_id):

    # Anyone can read comments
    if request.method == 'GET':
        comments = Comment.objects.filter(
            post_id=post_id
        ).order_by('created_at')

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    # Only logged-in users can comment
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Please log in to comment.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not Post.objects.filter(id=post_id).exists():
        return Response(
            {'error': 'Post not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    data = request.data.copy()
    data['post'] = post_id

    # Require either text or a video
    if not data.get('content') and not data.get('video'):
        return Response(
            {'error': 'Please enter a comment or attach a video.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = CommentSerializer(data=data)

    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



@api_view(['GET', 'POST'])
def like_list(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response(
            {'error': 'Post not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Identify the logged-in user
    user = request.user if request.user.is_authenticated else None

    if request.method == 'GET':
        likes_count = Like.objects.filter(post=post).count()

        liked = False
        if user:
            liked = Like.objects.filter(
                post=post,
                author=user
            ).exists()

        return Response({
            'count': likes_count,
            'liked': liked
        })

    # Only logged-in users can like posts
    if not user:
        return Response(
            {'error': 'Please log in to like a post.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    like, created = Like.objects.get_or_create(
        post=post,
        author=user
    )

    if created:
        return Response({
            'count': Like.objects.filter(post=post).count(),
            'liked': True
        }, status=status.HTTP_201_CREATED)

    like.delete()

    return Response({
        'count': Like.objects.filter(post=post).count(),
        'liked': False
    })


@api_view(['DELETE'])
def delete_post(request, post_id):
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Please log in to delete a post.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response(
            {'error': 'Post not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check the actual authenticated user
    if post.author != request.user:
        return Response(
            {'error': 'You cannot delete this post.'},
            status=status.HTTP_403_FORBIDDEN
        )

    post.delete()

    return Response(
        {'message': 'Post deleted successfully.'},
        status=status.HTTP_200_OK
    )



@api_view(['DELETE'])
def delete_comment(request, post_id, comment_id):

    if not request.user.is_authenticated:
        return Response(
            {'error': 'Please log in to delete a comment.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        comment = Comment.objects.get(
            id=comment_id,
            post_id=post_id
        )
    except Comment.DoesNotExist:
        return Response(
            {'error': 'Comment not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check the actual logged-in user
    if comment.author != request.user:
        return Response(
            {'error': 'You cannot delete this comment.'},
            status=status.HTTP_403_FORBIDDEN
        )

    comment.delete()

    return Response(
        {'message': 'Comment deleted successfully.'},
        status=status.HTTP_200_OK
    )
