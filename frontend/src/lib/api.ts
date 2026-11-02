import type { ApiErrorBody, CreateQuizPayload, Quiz, QuizListItem } from '@/types/quiz';

const PUBLIC_API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const API_URL =
    typeof window === 'undefined'
        ? (process.env.API_URL ?? PUBLIC_API_URL)
        : PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(status: number, message: string, errors?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`, body?.errors);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const getQuizzes = () => request<QuizListItem[]>('/quizzes');

export const getQuiz = (id: number | string) => request<Quiz>(`/quizzes/${id}`);

export const createQuiz = (payload: CreateQuizPayload) =>
  request<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(payload) });

export const deleteQuiz = (id: number | string) =>
  request<void>(`/quizzes/${id}`, { method: 'DELETE' });

export const updateQuiz = (id: number | string, payload: CreateQuizPayload) =>
  request<Quiz>(`/quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
