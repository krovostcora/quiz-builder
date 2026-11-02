import {z} from 'zod';

const baseQuestion = {
    text: z.string().trim().min(1, 'Question text is required').max(255),
};

const booleanQuestion = z.object({
    ...baseQuestion,
    type: z.literal('boolean'),
    correctAnswer: z.boolean(),
});

const inputQuestion = z.object({
    ...baseQuestion,
    type: z.literal('input'),
    correctAnswer: z.string().trim().min(1, 'Answer is required'),
});

const checkboxQuestion = z.object({
    ...baseQuestion,
    type: z.literal('checkbox'),
    options: z.array(z.string().trim().min(1)).min(2, 'At least 2 options are required'),
    correctAnswer: z.array(z.string()).min(1, 'Select at least 1 correct answer'),
});

const questionSchema = z
    .discriminatedUnion('type', [booleanQuestion, inputQuestion, checkboxQuestion])
    .superRefine((question, ctx) => {
        if (question.type !== 'checkbox') return;

        const allValid = question.correctAnswer.every((answer) => question.options.includes(answer));
        if (!allValid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['correctAnswer'],
                message: 'Correct answers must be among the options',
            });
        }
    });

export const createQuizSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100),
    questions: z.array(questionSchema).min(1, 'Add at least 1 question'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

// Update replaces the whole quiz, so it follows the same rules as create
export const updateQuizSchema = createQuizSchema;
export type UpdateQuizInput = CreateQuizInput;