from types import SimpleNamespace

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase
from rest_framework import serializers

from community.serializers import (
    PostSerializer,
    MAX_VIDEO_SIZE_MB,
    validate_video_size,
)


class VideoValidationTests(SimpleTestCase):
    def test_rejects_oversized_video(self):
        too_big = SimpleNamespace(size=MAX_VIDEO_SIZE_MB * 1024 * 1024 + 1)
        with self.assertRaises(serializers.ValidationError):
            validate_video_size(too_big)

    def test_accepts_video_within_limit(self):
        validate_video_size(SimpleNamespace(size=1024))  # no raise

    def test_rejects_non_video_extension(self):
        bad = SimpleUploadedFile('malware.exe', b'xx')
        s = PostSerializer(data={'content': 'hi', 'video': bad})
        self.assertFalse(s.is_valid())
        self.assertIn('video', s.errors)

    def test_accepts_allowed_extension(self):
        ok = SimpleUploadedFile('clip.mp4', b'tiny', content_type='video/mp4')
        s = PostSerializer(data={'content': 'hi', 'video': ok})
        self.assertTrue(s.is_valid(), s.errors)
