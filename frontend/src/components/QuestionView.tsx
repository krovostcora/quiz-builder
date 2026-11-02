'use client';

import PixelCard from '@/components/ui/PixelCard';
import PixelInput from '@/components/ui/PixelInput';
import type { Question } from '@/types/quiz';

// boolean for boolean questions, string for input, string[] for checkbox
export type Answer = boolean | string | string[] | undefined;

type QuestionViewProps = {
    question: Question;
    index: number;
    answer: Answer;
    revealed: boolean;
    onChange: (answer: Answer) => void;
};

type ChoiceState = 'idle' | 'selected' | 'correct' | 'missed' | 'wrong';

const TYPE_LABELS: Record<Question['type'], string> = {
    boolean: 'True / False',
    input: 'Text answer',
    checkbox: 'Multiple choice',
};

const STATE_CLASSES: Record<ChoiceState, string> = {
    idle: 'bg-white hover:bg-mint-100',
    selected: 'bg-mint-100',
    correct: 'bg-mint-200',
    missed: 'bg-mint-200',
    wrong: 'bg-danger text-white',
};

const STATE_TAGS: Partial<Record<ChoiceState, string>> = {
    correct: 'Your answer · correct',
    wrong: 'Your answer · wrong',
    missed: 'Correct answer',
};

function getState(
    selected: boolean,
    correct: boolean,
    revealed: boolean,
): ChoiceState {
    if (!revealed) return selected ? 'selected' : 'idle';
    if (correct) return selected ? 'correct' : 'missed';
    return selected ? 'wrong' : 'idle';
}

function normalize(value: string) {
    return value.trim().toLowerCase();
}

type ChoiceRowProps = {
    label: string;
    inputType: 'radio' | 'checkbox';
    name: string;
    checked: boolean;
    correct: boolean;
    revealed: boolean;
    onChange: () => void;
};

function ChoiceRow({
                       label,
                       inputType,
                       name,
                       checked,
                       correct,
                       revealed,
                       onChange,
                   }: ChoiceRowProps) {
    const state = getState(checked, correct, revealed);
    const tag = STATE_TAGS[state];

    return (
        <li>
            <label
                className={`flex items-center gap-3 border-4 border-ink px-3 py-2 has-[:focus-visible]:outline-4 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet-pixel ${
                    STATE_CLASSES[state]
                } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <input
                    type={inputType}
                    name={name}
                    checked={checked}
                    disabled={revealed}
                    onChange={onChange}
                    className="sr-only"
                />
                <span
                    aria-hidden
                    className={`flex h-6 w-6 shrink-0 items-center justify-center border-4 border-ink ${
                        checked
                            ? state === 'wrong'
                                ? 'bg-danger-dark'
                                : 'bg-violet-pixel'
                            : 'bg-white'
                    }`}
                >
          {checked && <span className="h-2 w-2 bg-white" />}
        </span>
                <span className="break-words">{label}</span>
                {tag && (
                    <span className="ml-auto font-pixel text-[10px] uppercase">
            {tag}
          </span>
                )}
            </label>
        </li>
    );
}

export default function QuestionView({
                                         question,
                                         index,
                                         answer,
                                         revealed,
                                         onChange,
                                     }: QuestionViewProps) {
    const name = `question-${question.id}`;
    const given = typeof answer === 'string' ? answer : '';
    const selectedOptions = Array.isArray(answer) ? answer : [];
    const isInputCorrect =
        question.type === 'input' &&
        normalize(given) === normalize(question.correctAnswer);

    function toggleOption(option: string) {
        const next = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];
        onChange(next.length > 0 ? next : undefined);
    }

    return (
        <PixelCard
            title={`Q${index + 1} · ${TYPE_LABELS[question.type]}`}
            strip={question.type === 'checkbox' ? 'violet' : 'mint'}
        >
            <div className="flex flex-col gap-4">
                <p className="break-words text-2xl text-ink">{question.text}</p>

                {question.type === 'boolean' && (
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {[true, false].map((value) => (
                            <ChoiceRow
                                key={String(value)}
                                label={value ? 'True' : 'False'}
                                inputType="radio"
                                name={name}
                                checked={answer === value}
                                correct={question.correctAnswer === value}
                                revealed={revealed}
                                onChange={() => onChange(value)}
                            />
                        ))}
                    </ul>
                )}

                {question.type === 'checkbox' && (
                    <ul className="flex flex-col gap-2">
                        {question.options.map((option) => (
                            <ChoiceRow
                                key={option}
                                label={option}
                                inputType="checkbox"
                                name={name}
                                checked={selectedOptions.includes(option)}
                                correct={question.correctAnswer.includes(option)}
                                revealed={revealed}
                                onChange={() => toggleOption(option)}
                            />
                        ))}
                    </ul>
                )}

                {question.type === 'input' &&
                    (revealed ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div
                                className={`border-4 border-ink px-3 py-2 ${
                                    isInputCorrect ? 'bg-mint-200' : 'bg-danger text-white'
                                }`}
                            >
                                <span className="font-pixel text-[10px]">YOUR ANSWER</span>
                                <p className="break-words">{given}</p>
                            </div>
                            <div className="border-4 border-ink bg-mint-200 px-3 py-2">
                                <span className="font-pixel text-[10px]">CORRECT ANSWER</span>
                                <p className="break-words">{question.correctAnswer}</p>
                            </div>
                        </div>
                    ) : (
                        <PixelInput
                            label="Your answer"
                            placeholder="Type your answer"
                            value={given}
                            onChange={(event) => onChange(event.target.value)}
                        />
                    ))}
            </div>
        </PixelCard>
    );
}