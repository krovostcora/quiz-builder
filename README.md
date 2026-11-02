# Quiz Builder

A full-stack app for creating and viewing custom quizzes. Pixel-art look with a mint palette and a light/dark theme.

- **Backend:** Node.js, Express, TypeScript, Sequelize, SQLite, Zod
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form, Zod
- **Quality:** ESLint + Prettier in both packages

## Features

- Create a quiz with a title and any number of questions
- Three question types:
    - **Boolean:** True / False
    - **Input:** short text answer
    - **Checkbox:** several options, one or more correct
- Quiz list with question counts and delete (two-step confirmation)
- Quiz page where you can answer the questions and compare with the correct answers
- Light/dark theme switcher
- Edit an existing quiz (title and questions)

## Project structure

```
quiz-builder/
├── backend/     # REST API (Express + Sequelize + SQLite)
└── frontend/    # Web app (Next.js)
```

## Requirements

- Node.js 20.9 or newer
- npm

## Getting started

Run the backend first, then the frontend. Use two terminals.

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed   # optional: creates an example quiz
npm run dev
```

The API starts on <http://localhost:4000>. Check it: <http://localhost:4000/health>.

Environment variables (`backend/.env`):

| Variable      | Default                 | Description                      |
| ------------- | ----------------------- | -------------------------------- |
| `PORT`        | `4000`                  | API port                         |
| `CLIENT_URL`  | `http://localhost:3000` | Allowed CORS origin (frontend)   |
| `DB_STORAGE`  | `./database.sqlite`     | Path to the SQLite database file |

Scripts:

| Script               | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start with auto-reload (tsx watch)   |
| `npm run build`      | Compile TypeScript to `dist/`        |
| `npm start`          | Run the compiled build               |
| `npm run seed`       | Add an example quiz to the database  |
| `npm run lint`       | Run ESLint                           |
| `npm run format`     | Run Prettier                         |

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app starts on <http://localhost:3000>.

Environment variables (`frontend/.env`):

| Variable               | Default                 | Description  |
| ---------------------- | ----------------------- | ------------ |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:4000` | Backend URL  |

Scripts:

| Script           | Description                  |
| ---------------- | ---------------------------- |
| `npm run dev`    | Start the dev server         |
| `npm run build`  | Production build             |
| `npm start`      | Run the production build     |
| `npm run lint`   | Run ESLint                   |
| `npm run format` | Run Prettier                 |

## Run with Docker

Requires Docker with Compose. From the repository root:

```bash
docker compose up --build
```

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:4000>

Add the example quiz: `docker compose exec backend node dist/seed.js`.
Data is stored in the `quiz-data` volume. To reset it: `docker compose down -v`.

## Database

SQLite is used, so no separate database server is needed. The database file is created at the path from `DB_STORAGE` (by default `backend/database.sqlite`). To start from scratch, stop the backend and delete that file.

Data model:

- **Quiz:** `id`, `title`, `createdAt`, `updatedAt`
- **Question:** `id`, `quizId`, `text`, `type` (`boolean | input | checkbox`), `options` (JSON), `correctAnswer` (JSON), `order`

## Creating a quiz

**Through the UI:** open <http://localhost:3000/create>, enter a title, add questions, choose a type in each question card, and press **Create quiz**.

**Through the API:**

```bash
curl -X POST http://localhost:4000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript basics",
    "questions": [
      { "type": "boolean", "text": "JavaScript is a compiled language.", "correctAnswer": false },
      { "type": "input", "text": "Which keyword declares a constant?", "correctAnswer": "const" },
      {
        "type": "checkbox",
        "text": "Which are primitive types?",
        "options": ["string", "object", "number", "array"],
        "correctAnswer": ["string", "number"]
      }
    ]
  }'
```

## API

Base URL: `http://localhost:4000`

| Method   | Endpoint        | Description                                      | Success |
| -------- | --------------- | ------------------------------------------------ | ------- |
| `POST`   | `/quizzes`      | Create a quiz with questions                     | `201`   |
| `GET`    | `/quizzes`      | List quizzes (`id`, `title`, `createdAt`, `questionsCount`) | `200`   |
| `GET`    | `/quizzes/:id`  | Get a quiz with all its questions                | `200`   |
| `DELETE` | `/quizzes/:id`  | Delete a quiz                                    | `204`   |
| `PUT`    | `/quizzes/:id`  | Replace a quiz (same body as `POST`)             | `200`   |
| `GET`    | `/health`       | Health check                                     | `200`   |

Request body for `POST /quizzes`:

- `title`: string, 1-100 characters
- `questions`: array, at least 1 item. Each question has `text` (1-255 characters) and a `type`:
    - `boolean`: `correctAnswer` is `true` or `false`
    - `input`: `correctAnswer` is a string
    - `checkbox`: `options` is an array of at least 2 strings, `correctAnswer` is an array of at least 1 string taken from `options`

Errors:

- `400` validation error: `{ "message": "...", "errors": [...] }`
- `404` quiz or route not found: `{ "message": "..." }`
- `500` server error: `{ "message": "Internal server error" }`

## Frontend routes

| Route            | Description                                   |
| ---------------- | --------------------------------------------- |
| `/`              | Redirects to `/quizzes`                       |
| `/quizzes`       | Quiz list, delete                             |
| `/quizzes/[id]`  | Answer the questions and compare with answers |
| `/create`        | Create a quiz                                 |
| `/quizzes/[id]/edit` | Edit a quiz                               |