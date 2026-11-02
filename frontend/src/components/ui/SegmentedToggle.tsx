type SegmentedToggleProps<T extends string | boolean> = {
    label: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
    className?: string;
};

export default function SegmentedToggle<T extends string | boolean>({
                                                                        label,
                                                                        value,
                                                                        options,
                                                                        onChange,
                                                                        className = '',
                                                                    }: SegmentedToggleProps<T>) {
    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={`flex border-4 border-ink bg-white shadow-pixel-sm ${className}`}
        >
            {options.map((option, index) => {
                const active = option.value === value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(option.value)}
                        className={`flex-1 px-3 py-2 font-pixel text-[10px] uppercase focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-violet-pixel ${
                            index > 0 ? 'border-l-4 border-ink' : ''
                        } ${
                            active
                                ? 'bg-violet-pixel text-white'
                                : 'bg-white text-ink hover:bg-mint-100'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}