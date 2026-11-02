import { z } from 'zod';
import type { CreateQuizPayload } from '@/types/quiz';

const text = z
    .string()
    .trim()
    .min(1, 'Required')
    .max(255, 'Max 255 characters');

const booleanQuestion = z.object({
    type: z.literal('boolean'),
    text,
    correctAnswer: z.boolean(),
});

const inputQuestion = z.object({
    type: z.literal('input'),
    text,
    correctAnswer: z.string().trim().min(1, 'Required').max(255),
});

// Options are objects (not strings) so useFieldArray can manage them
const checkboxQuestion = z.object({
    type: z.literal('checkbox'),
    text,
    options: z
        .array(
            z.object({
                text: z.string().trim().min(1, 'Required').max(255),
                correct: z.boolean(),
            }),
        )
        .min(2, 'Add at least 2 options'),
});

export const quizFormSchema = z.object({
    title: z.string().trim().min(1, 'Required').max(100, 'Max 100 characters'),
    questions: z
        .array(
            z.discriminatedUnion('type', [
                booleanQuestion,
                inputQuestion,
                checkboxQuestion,
            ]),
        )
        .min(1, 'Add at least 1 question')
        .superRefine((questions, ctx) => {
            // Cross-field checks for checkbox questions
            questions.forEach((question, index) => {
                if (question.type !== 'checkbox') return;

                if (!question.options.some((option) => option.correct)) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Mark at least 1 correct option',
                        path: [index, 'options'],
                    });
                }

                const texts = question.options.map((option) => option.text);
                if (new Set(texts).size !== texts.length) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Options must be unique',
                        path: [index, 'options'],
                    });
                }
            });
        }),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = QuizFormValues['questions'][number];

export function createEmptyQuestion(
    type: QuestionFormValues['type'],
): QuestionFormValues {
    switch (type) {
        case 'boolean':
            return { type, text: '', correctAnswer: true };
        case 'input':
            return { type, text: '', correctAnswer: '' };
        case 'checkbox':
            return {
                type,
                text: '',
                options: [
                    { text: '', correct: false },
                    { text: '', correct: false },
                ],
            };
    }
}

// Map form values to the API payload
export function toPayload(values: QuizFormValues): CreateQuizPayload {
    return {
        title: values.title,
        questions: values.questions.map((question) => {
            if (question.type === 'checkbox') {
                return {
                    type: 'checkbox',
                    text: question.text,
                    options: question.options.map((option) => option.text),
                    correctAnswer: question.options
                        .filter((option) => option.correct)
                        .map((option) => option.text),
                };
            }
            return question;
        }),
    };
}