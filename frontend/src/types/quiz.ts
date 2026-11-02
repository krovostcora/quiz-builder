export type QuestionType = 'boolean' | 'input' | 'checkbox';

interface QuestionBase {
  id: number;
  quizId: number;
  text: string;
  order: number;
}

export interface BooleanQuestion extends QuestionBase {
  type: 'boolean';
  options: null;
  correctAnswer: boolean;
}

export interface InputQuestion extends QuestionBase {
  type: 'input';
  options: null;
  correctAnswer: string;
}

export interface CheckboxQuestion extends QuestionBase {
  type: 'checkbox';
  options: string[];
  correctAnswer: string[];
}

export type Question = BooleanQuestion | InputQuestion | CheckboxQuestion;

export interface QuizListItem {
  id: number;
  title: string;
  createdAt: string;
  questionsCount: number;
}

export interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export type CreateQuestionPayload =
  | { type: 'boolean'; text: string; correctAnswer: boolean }
  | { type: 'input'; text: string; correctAnswer: string }
  | {
      type: 'checkbox';
      text: string;
      options: string[];
      correctAnswer: string[];
    };

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestionPayload[];
}

export interface ApiErrorBody {
  message: string;
  errors?: unknown;
}
