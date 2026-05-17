# 🐭 Chinchilla Breeders Platform

> A full-stack web application for chinchilla breeders — manage your animals, connect with other breeders, and chat in real time.

![Python](https://img.shields.io/badge/Python-3.14-blue?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-6.0-green?style=for-the-badge&logo=django)
![Angular](https://img.shields.io/badge/Angular-21-red?style=for-the-badge&logo=angular)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)

---

## ✨ Features

- 🔐 **JWT Authentication** — register, login, auto token refresh
- 🐭 **Chinchilla Management** — full CRUD with owner-based access control
- 👤 **Breeder Profiles** — view and edit your profile
- 💬 **Real-time Chat** — WebSocket-powered messaging between breeders
- 🎨 **Modern UI** — Angular Material with dark theme and animations
- 🐳 **Dockerized** — one command to run everything

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.14 | Language |
| Django | 6.0 | Web framework |
| Django REST Framework | 3.17 | REST API |
| Django Channels | 4.x | WebSocket support |
| SimpleJWT | 5.x | JWT authentication |
| PostgreSQL | 17 | Primary database |
| Redis | 7 | WebSocket channel layer |
| Daphne | 4.x | ASGI server |
| uv | latest | Package manager |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 21 | SPA framework |
| Angular Material | 21 | UI components |
| TypeScript | 5.x | Language |
| RxJS | 7.x | Reactive programming |
| WebSocket API | — | Real-time chat |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

## 📁 Project Structure

```
pet-chinchilla/
├── pet_chinchilla_back/          # Django backend
│   ├── apps/
│   │   ├── auth_app/             # JWT auth, Breeder model
│   │   ├── breeders_app/         # Breeder profiles
│   │   ├── chinchillas_app/      # Chinchilla CRUD
│   │   └── chat_app/             # WebSocket chat
│   ├── pet_chinchilla_back/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── asgi.py               # ASGI + Channels routing
│   └── manage.py
├── pet_chinchilla_front/         # Angular frontend
│   └── src/app/
│       ├── core/
│       │   ├── services/         # HTTP + WebSocket services
│       │   ├── interceptors/     # JWT interceptor
│       │   └── guards/           # Route guards
│       ├── features/
│       │   ├── auth/             # Login, Register
│       │   ├── chinchillas/      # List, Form
│       │   ├── breeders/         # Profile
│       │   └── chat/             # Conversation
│       └── shared/
│           └── components/       # Navbar
├── docker-compose.yaml
├── Dockerfile.backend
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) 22+ and npm
- [Angular CLI](https://angular.dev/tools/cli) 21+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pet-chinchilla.git
cd pet-chinchilla
```

### 2. Configure environment variables

Create `.env` in the root directory:

```ini
DB_NAME=chinchilla_db
DB_USER=chinchilla_user
DB_PASSWORD=chinchilla_pass
DB_HOST=db
DB_PORT=5432
REDIS_HOST=redis
```

Create `pet_chinchilla_back/.env` for Django:

```ini
DB_NAME=chinchilla_db
DB_USER=chinchilla_user
DB_PASSWORD=chinchilla_pass
DB_HOST=db
DB_PORT=5432
REDIS_HOST=redis
```

### 3. Start the backend

```bash
# Build and start containers
docker compose up -d --build

# Apply migrations
docker compose exec backend uv run python manage.py migrate

# Create superuser (optional)
docker compose exec backend uv run python manage.py createsuperuser
```

Backend will be available at `http://localhost:8000`

### 4. Start the frontend

```bash
cd chinchilla-frontend
npm install
ng serve
```

Frontend will be available at `http://localhost:4200`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new breeder |
| POST | `/api/auth/token/` | Obtain JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### Breeders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/breeders/` | List all breeders |
| GET | `/api/breeders/me/` | Get current breeder profile |
| PATCH | `/api/breeders/me/` | Update current breeder profile |

### Chinchillas
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chinchillas/` | List own chinchillas |
| POST | `/api/chinchillas/` | Create a chinchilla |
| GET | `/api/chinchillas/{id}/` | Get chinchilla details |
| PATCH | `/api/chinchillas/{id}/` | Update a chinchilla |
| DELETE | `/api/chinchillas/{id}/` | Delete a chinchilla |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/messages/?with={id}` | Get message history |
| WS | `ws://host/ws/chat/{id}/?token=` | Real-time chat connection |

---

## 🧪 Running Tests

```bash
# Run all tests
docker compose exec backend uv run python manage.py test apps

# Run tests for a specific app
docker compose exec backend uv run python manage.py test apps.auth_app
docker compose exec backend uv run python manage.py test apps.breeders_app
docker compose exec backend uv run python manage.py test apps.chinchillas_app
docker compose exec backend uv run python manage.py test apps.chat_app
```

**Test coverage: 31 tests — all passing ✅**

---

## 🏗 Architecture

```
Browser (Angular SPA)
        │
        ├── HTTP Requests ──────► Daphne (ASGI)
        │                              │
        └── WebSocket ─────────────────┤
                                       │
                              Django + DRF + Channels
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                   │
               PostgreSQL           Redis            Django Admin
             (persistent data)  (channel layer)
```

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ and 🐭
</div>
