import PixelCard from '@/components/ui/PixelCard';
import type { Question } from '@/types/quiz';

type QuestionViewProps = {
    question: Question;
    index: number;
};

const TYPE_LABELS: Record<Question['type'], string> = {
    boolean: 'True / False',
    input: 'Text answer',
    checkbox: 'Multiple choice',
};

function Marker({ checked }: { checked: boolean }) {
    return (
        <span
            aria-hidden
            className={`flex h-6 w-6 shrink-0 items-center justify-center border-4 border-ink ${
                checked ? 'bg-violet-pixel' : 'bg-white'
            }`}
        >
      {checked && <span className="h-2 w-2 bg-white" />}
    </span>
    );
}

function AnswerRow({ label, correct }: { label: string; correct: boolean }) {
    return (
        <li
            className={`flex items-center gap-3 border-4 border-ink px-3 py-2 ${
                correct ? 'bg-mint-200' : 'bg-white'
            }`}
        >
            <Marker checked={correct} />
            <span className="break-words">{label}</span>
            {correct && <span className="sr-only">(correct answer)</span>}
        </li>
    );
}

export default function QuestionView({ question, index }: QuestionViewProps) {
    return (
        <PixelCard
            title={`Q${index + 1} · ${TYPE_LABELS[question.type]}`}
            strip={question.type === 'checkbox' ? 'violet' : 'mint'}
        >
            <div className="flex flex-col gap-4">
                <p className="break-words text-2xl text-ink">{question.text}</p>

                {question.type === 'boolean' && (
                    <ul className="flex flex-col gap-2 sm:flex-row">
                        <AnswerRow label="True" correct={question.correctAnswer === true} />
                        <AnswerRow
                            label="False"
                            correct={question.correctAnswer === false}
                        />
                    </ul>
                )}

                {question.type === 'input' && (
                    <div className="border-4 border-ink bg-mint-200 px-3 py-2">
            <span className="font-pixel text-[10px] text-ink-soft">
              CORRECT ANSWER
            </span>
                        <p className="break-words text-ink">{question.correctAnswer}</p>
                    </div>
                )}

                {question.type === 'checkbox' && (
                    <ul className="flex flex-col gap-2">
                        {question.options.map((option) => (
                            <AnswerRow
                                key={option}
                                label={option}
                                correct={question.correctAnswer.includes(option)}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </PixelCard>
    );
}