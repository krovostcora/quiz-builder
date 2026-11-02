'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import QuestionEditor from '@/components/QuestionEditor';
import PixelButton, { pixelButtonClasses } from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import PixelInput from '@/components/ui/PixelInput';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { ApiError, createQuiz, updateQuiz } from '@/lib/api';
import {
  createEmptyQuestion,
  quizFormSchema,
  toFormValues,
  toPayload,
  type QuestionFormValues,
  type QuizFormValues,
} from '@/lib/schemas/quiz';
import type { Quiz } from '@/types/quiz';

type ArrayError = { message?: string; root?: { message?: string } };

type QuizFormProps = {
  // When provided, the form edits this quiz instead of creating a new one
  quiz?: Quiz;
};

export default function QuizForm({ quiz }: QuizFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quiz
      ? toFormValues(quiz)
      : { title: '', questions: [createEmptyQuestion('boolean')] },
  });

  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'questions',
  });

  useUnsavedChangesWarning(Boolean(quiz) && isDirty);

  const questionsError = errors.questions as unknown as ArrayError | undefined;
  const questionsMessage = questionsError?.root?.message ?? questionsError?.message;

  // Switch type but keep the question text
  function handleTypeChange(index: number, type: QuestionFormValues['type']) {
    if (getValues(`questions.${index}.type`) === type) return;
    const text = getValues(`questions.${index}.text`);
    update(index, { ...createEmptyQuestion(type), text });
  }

  async function onSubmit(values: QuizFormValues) {
    setSubmitError(null);
    try {
      if (quiz) {
        await updateQuiz(quiz.id, toPayload(values));
        router.push(`/quizzes/${quiz.id}`);
      } else {
        await createQuiz(toPayload(values));
        router.push('/quizzes');
      }
      // Refetch server data so lists and pages show the latest version
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : 'Could not reach the server. Try again.',
      );
    }
  }

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <PixelCard title="Quiz" strip="mint">
          <PixelInput
            label="Title"
            placeholder="My awesome quiz"
            error={errors.title?.message}
            {...register('title')}
          />
        </PixelCard>

        <ol className="flex flex-col gap-6">
          {fields.map((field, index) => (
            <li key={field.id}>
              <QuestionEditor
                index={index}
                onRemove={() => remove(index)}
                onTypeChange={(type) => handleTypeChange(index, type)}
              />
            </li>
          ))}
        </ol>

        {questionsMessage && (
          <p role="alert" className="text-danger-dark">
            {questionsMessage}
          </p>
        )}

        <div>
          <PixelButton type="button" onClick={() => append(createEmptyQuestion('boolean'))}>
            + Add question
          </PixelButton>
        </div>

        {submitError && (
          <p role="alert" className="border-ink bg-surface text-danger-dark border-4 px-3 py-2">
            {submitError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <PixelButton type="submit" variant="accent" disabled={isSubmitting}>
            {quiz
              ? isSubmitting
                ? 'Saving...'
                : 'Save changes'
              : isSubmitting
                ? 'Creating...'
                : 'Create quiz'}
          </PixelButton>
          <Link
            href={quiz ? `/quizzes/${quiz.id}` : '/quizzes'}
            className={pixelButtonClasses('default', 'md')}
          >
            Cancel
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
