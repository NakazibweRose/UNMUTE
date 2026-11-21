from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def link_authors(apps, schema_editor):
    """Map each row's author username string to a real User.

    Rows whose author never matched a registered account (legacy data from
    before auth was wired in) are deleted: a non-null FK cannot keep them.
    """
    User = apps.get_model('auth', 'User')
    users = {u.username: u for u in User.objects.all()}

    for model_name in ('Post', 'Comment', 'Like'):
        Model = apps.get_model('community', model_name)
        for row in Model.objects.all():
            user = users.get(row.author)
            if user is None:
                row.delete()
            else:
                row.author_user = user
                row.save(update_fields=['author_user'])


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('community', '0005_post_video_alter_post_content'),
    ]

    operations = [
        # Drop the Like constraint that references the old author column.
        migrations.AlterUniqueTogether(name='like', unique_together=set()),

        # Add nullable FK columns alongside the old CharFields.
        migrations.AddField(
            model_name='post',
            name='author_user',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name='comment',
            name='author_user',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name='like',
            name='author_user',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),

        migrations.RunPython(link_authors, migrations.RunPython.noop),

        # Remove old CharFields, promote the FK columns to `author`.
        migrations.RemoveField(model_name='post', name='author'),
        migrations.RemoveField(model_name='comment', name='author'),
        migrations.RemoveField(model_name='like', name='author'),
        migrations.RenameField(
            model_name='post', old_name='author_user', new_name='author'),
        migrations.RenameField(
            model_name='comment', old_name='author_user', new_name='author'),
        migrations.RenameField(
            model_name='like', old_name='author_user', new_name='author'),

        # Finalise: non-null + related_name.
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='posts',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='comments',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='like',
            name='author',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='likes',
                to=settings.AUTH_USER_MODEL,
            ),
        ),

        # Restore the Like uniqueness, now on the FK.
        migrations.AlterUniqueTogether(
            name='like', unique_together={('post', 'author')}),
    ]
