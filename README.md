# UNMUTE

**Learn, communicate, connect** — an inclusive learning and community platform for Deaf and hearing people, built around **Ugandan Sign Language (UgSL)**.

> 🏆 **Winner — Africa's Talking Women in Tech Hackathon (Innovating for EdTech)**, Uganda, 21 November 2026.

UNMUTE teaches UgSL through short video lessons, gives everyday phrases in English and Luganda, and runs a community space where learners share progress. A USSD service extends the same greetings and phrases to basic feature phones — no smartphone or data required.

---

## Live demo

| Surface | URL |
|---------|-----|
| Frontend | https://unmute-frontend-6otw.onrender.com |
| Backend API | https://unmute-backend-u0ob.onrender.com |

Demo accounts (seeded): `amina`, `david`, `grace`, `samuel` — password `demopass123`.

---

## What's inside

- **Lessons** — UgSL categories (Greetings, Family, School, Community, Healthcare, Everyday) with sign-demonstration videos.
- **Communication phrasebook** — common phrases in English + Luganda, each with a sign video, searchable by category.
- **Community** — posts, comments and likes so learners support each other.
- **USSD service** — stateless English/Luganda menu so anyone with a feature phone can reach core content.
- **Sign recognition (Phase 1)** — a MediaPipe hand-landmark + NumPy classifier pipeline, kept as a standalone module.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS v4, lucide-react |
| Backend | Django + Django REST Framework (token & session auth, pagination) |
| Database | PostgreSQL (Render) / SQLite (local dev) |
| USSD | Africa's Talking USSD callback (`POST /api/ussd/callback/`) |
| Sign recognition | MediaPipe, NumPy |
| Hosting | Render (blueprint in [`render.yaml`](render.yaml)) |

---

## Repository layout

```
UNMUTE/
├── backend/           # Django + DRF: accounts, community, ussd  (see backend/README.md)
├── frontend/          # React + Vite + Tailwind app              (see frontend/README.md)
├── sign_recognition/  # MediaPipe + NumPy sign classifier (Phase 1)
└── render.yaml        # Render deployment blueprint
```

---

## Getting started

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then set DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver      # http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

Point the frontend at the backend by setting `VITE_API_URL` (e.g. `http://127.0.0.1:8000` locally, or the live backend URL in production).

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for details.

---

## Deployment

The repo ships a [`render.yaml`](render.yaml) blueprint that provisions the Django backend, the static frontend, and a PostgreSQL database. After the first deploy, set the frontend's `VITE_API_URL` to the backend URL and redeploy the frontend.

---

## License

Built for the Africa's Talking Women in Tech Hackathon, 2026.
