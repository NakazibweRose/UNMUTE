"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        'service': 'UNMUTE backend',
        'endpoints': {
            'posts': '/api/community/posts/',
            'register': '/api/accounts/register/',
            'login': '/api/accounts/login/',
            'ussd_callback': '/api/ussd/callback/',
            'admin': '/admin/',
        },
    })


urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/community/', include('community.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/ussd/', include('ussd.urls')),
]

# ponytail: serve uploaded media through Django even in prod. Fine for a demo,
# but Render's free filesystem is ephemeral so uploads vanish on every redeploy
# — move media to object storage (S3/Cloudflare R2) before real traffic.
urlpatterns += [
    re_path(
        r'^media/(?P<path>.*)$',
        serve,
        {'document_root': settings.MEDIA_ROOT},
    ),
]
