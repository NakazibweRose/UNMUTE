# UNMUTE — Backend

Django + DRF backend for UNMUTE: a community platform plus a USSD service that
promote inclusive learning and communication for Deaf and hearing communities.

## Apps
- **accounts** — token-auth register / login.
- **community** — posts, comments, likes (text + video).
- **ussd** — stateless USSD menu (English / Luganda).

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then set DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver
```

## Configuration
Settings read from the environment (or a local `.env`):

| Variable | Default | Notes |
|----------|---------|-------|
| `DJANGO_SECRET_KEY` | insecure dev key | **Required in production.** |
| `DJANGO_DEBUG` | `True` | Set `False` in production. |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated. |

## API
- `POST /api/accounts/register/`, `POST /api/accounts/login/`
- `GET|POST /api/community/posts/`
- `GET|POST /api/community/posts/<id>/comments/`
- `GET|POST /api/community/posts/<id>/likes/`  (POST toggles)
- `DELETE /api/community/posts/<id>/delete/`
- `DELETE /api/community/posts/<id>/comments/<cid>/delete/`
- `POST /api/ussd/callback/`
