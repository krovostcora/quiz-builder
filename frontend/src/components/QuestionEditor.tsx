'use client';

import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import CheckboxOptionsEditor from '@/components/CheckboxOptionsEditor';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import PixelInput from '@/components/ui/PixelInput';
import SegmentedToggle from '@/components/ui/SegmentedToggle';
import type { QuestionFormValues, QuizFormValues } from '@/lib/schemas/quiz';

type QuestionType = QuestionFormValues['type'];

type QuestionEditorProps = {
    index: number;
    onRemove: () => void;
    onTypeChange: (type: QuestionType) => void;
};

type QuestionErrors = {
    text?: { message?: string };
    correctAnswer?: { message?: string };
};

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
    { value: 'boolean', label: 'True/False' },
    { value: 'input', label: 'Text' },
    { value: 'checkbox', label: 'Choice' },
];

const BOOLEAN_OPTIONS = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
];

// Two-click remove: first click asks "Sure?", second one removes
function RemoveButton({
                          index,
                          onRemove,
                      }: {
    index: number;
    onRemove: () => void;
}) {
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (!confirming) return;
        const timer = setTimeout(() => setConfirming(false), 3000);
        return () => clearTimeout(timer);
    }, [confirming]);

    return (
        <PixelButton
            type="button"
            variant="danger"
            size="sm"
            aria-label={
                confirming
                    ? `Confirm removing question ${index + 1}`
                    : `Remove question ${index + 1}`
            }
            onClick={() => (confirming ? onRemove() : setConfirming(true))}
            onBlur={() => setConfirming(false)}
        >
            {confirming ? 'Sure?' : 'X'}
        </PixelButton>
    );
}

export default function QuestionEditor({
                                           index,
                                           onRemove,
                                           onTypeChange,
                                       }: QuestionEditorProps) {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<QuizFormValues>();

    const type = useWatch({ control, name: `questions.${index}.type` });
    const questionErrors = errors.questions?.[index] as unknown as
        | QuestionErrors
        | undefined;

    return (
        <PixelCard
            title={`Question ${index + 1}`}
            strip={type === 'checkbox' ? 'violet' : 'mint'}
            actions={<RemoveButton index={index} onRemove={onRemove} />}
        >
            <div className="flex flex-col gap-5">
                <SegmentedToggle
                    label="Question type"
                    value={type}
                    options={TYPE_OPTIONS}
                    onChange={onTypeChange}
                />

                <PixelInput
                    label="Question"
                    placeholder="Type your question"
                    error={questionErrors?.text?.message}
                    {...register(`questions.${index}.text`)}
                />

                {type === 'boolean' && (
                    <div className="flex flex-col gap-2">
            <span className="font-pixel text-[10px] uppercase text-ink-soft">
              Correct answer
            </span>
                        <Controller
                            control={control}
                            name={`questions.${index}.correctAnswer`}
                            render={({ field }) => (
                                <SegmentedToggle
                                    label="Correct answer"
                                    value={field.value === true}
                                    options={BOOLEAN_OPTIONS}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                )}

                {type === 'input' && (
                    <PixelInput
                        label="Correct answer"
                        placeholder="Type the correct answer"
                        error={questionErrors?.correctAnswer?.message}
                        {...register(`questions.${index}.correctAnswer`)}
                    />
                )}

                {type === 'checkbox' && <CheckboxOptionsEditor index={index} />}
            </div>
        </PixelCard>
    );
}