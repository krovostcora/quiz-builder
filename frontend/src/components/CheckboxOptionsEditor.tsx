'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import PixelButton, { pixelButtonClasses } from '@/components/ui/PixelButton';
import PixelInput from '@/components/ui/PixelInput';
import type { QuizFormValues } from '@/lib/schemas/quiz';

type CheckboxOptionsEditorProps = {
    index: number;
};

const MIN_OPTIONS = 2;

type OptionsError = { message?: string; root?: { message?: string } };

export default function CheckboxOptionsEditor({
                                                  index,
                                              }: CheckboxOptionsEditorProps) {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<QuizFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${index}.options`,
    });

    // Errors of the whole options array live under "root" (resolver + field array)
    const questionErrors = errors.questions?.[index] as unknown as
        | { options?: OptionsError & Record<number, { text?: { message?: string } }> }
        | undefined;
    const optionsError = questionErrors?.options;
    const arrayMessage = optionsError?.root?.message ?? optionsError?.message;

    return (
        <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-pixel text-[10px] uppercase text-ink-soft">
                Options · tick the correct ones
            </legend>

            <ul className="flex flex-col gap-3">
                {fields.map((field, optionIndex) => (
                    <li key={field.id} className="flex items-start gap-2">
                        <label className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-4 border-ink bg-white has-[:checked]:bg-violet-pixel has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet-pixel">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                aria-label={`Option ${optionIndex + 1} is correct`}
                                {...register(
                                    `questions.${index}.options.${optionIndex}.correct`,
                                )}
                            />
                            <span
                                aria-hidden
                                className="hidden h-3 w-3 bg-white peer-checked:block"
                            />
                        </label>

                        <div className="min-w-0 flex-1">
                            <PixelInput
                                aria-label={`Option ${optionIndex + 1}`}
                                placeholder={`Option ${optionIndex + 1}`}
                                error={optionsError?.[optionIndex]?.text?.message}
                                {...register(`questions.${index}.options.${optionIndex}.text`)}
                            />
                        </div>

                        <button
                            type="button"
                            aria-label={`Remove option ${optionIndex + 1}`}
                            disabled={fields.length <= MIN_OPTIONS}
                            onClick={() => remove(optionIndex)}
                            className={pixelButtonClasses(
                                'danger',
                                'sm',
                                'h-12 w-12 shrink-0 px-0 disabled:pointer-events-none disabled:opacity-40',
                            )}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>

            {arrayMessage && (
                <p role="alert" className="text-danger-dark">
                    {arrayMessage}
                </p>
            )}

            <div>
                <PixelButton
                    type="button"
                    size="sm"
                    onClick={() => append({ text: '', correct: false })}
                >
                    + Add option
                </PixelButton>
            </div>
        </fieldset>
    );
}