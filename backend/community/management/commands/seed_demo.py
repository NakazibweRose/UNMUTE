"""Create demo accounts and sample community content.

Idempotent: safe to run more than once (uses get_or_create throughout).

    python manage.py seed_demo
"""
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from community.models import Comment, Like, Post

PASSWORD = "demopass123"

# (username, email, display name)
USERS = [
    ("amina", "amina@demo.unmute", "Amina Nakato"),
    ("david", "david@demo.unmute", "David Okello"),
    ("grace", "grace@demo.unmute", "Grace Achieng"),
    ("samuel", "samuel@demo.unmute", "Samuel Mugisha"),
]

# (author, category, content)
POSTS = [
    ("amina", "learning",
     "Just learned the signs for my family members today. "
     "Teaching my little brother tonight."),
    ("david", "questions",
     "What is the best way to practise finger-spelling every day? Any tips?"),
    ("grace", "community",
     "So grateful for this space. For the first time I can share my story "
     "in my own language."),
    ("samuel", "learning",
     "Finished the greetings lesson. The video demonstrations make it so "
     "much clearer."),
    ("amina", "questions",
     "Does anyone know the sign for 'thank you very much'? "
     "I only know the short version."),
]

# (post author, commenter, text) -> comment attaches to that author's first post
COMMENTS = [
    ("david", "grace",
     "Try practising with a mirror for ten minutes a day. It helped me a lot."),
    ("amina", "samuel",
     "That is wonderful. Family signs were my favourite to learn too."),
]

# (post author, [usernames who liked their first post])
LIKES = [
    ("grace", ["amina", "david", "samuel"]),
    ("amina", ["grace", "samuel"]),
    ("samuel", ["david"]),
]


class Command(BaseCommand):
    help = "Create demo accounts and sample community content for demos."

    def handle(self, *args, **options):
        users = {}
        for username, email, _name in USERS:
            user, created = User.objects.get_or_create(
                username=username, defaults={"email": email})
            if created:
                user.set_password(PASSWORD)
                user.save()
            users[username] = user

        for author, category, content in POSTS:
            Post.objects.get_or_create(
                author=users[author], content=content,
                defaults={"category": category})

        for post_author, commenter, text in COMMENTS:
            target = Post.objects.filter(author=users[post_author]).first()
            if target:
                Comment.objects.get_or_create(
                    post=target, author=users[commenter], content=text)

        for post_author, likers in LIKES:
            target = Post.objects.filter(author=users[post_author]).first()
            if target:
                for liker in likers:
                    Like.objects.get_or_create(post=target, author=users[liker])

        self.stdout.write(self.style.SUCCESS(
            f"Demo data ready. Password for every account: {PASSWORD}"))
        for username, _email, name in USERS:
            self.stdout.write(f"  {username:8} {name}")
