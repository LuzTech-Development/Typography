import { ReactNode } from 'react';

interface FieldProps {
    label: string;
    children: ReactNode;
    hint?: string;
    value?: string;
}

/**
 * A labeled control. The label is sentence case (not uppercase) — the
 * instrument reads like a spec sheet, not a dashboard. An optional `value`
 * renders a monospace readout on the right, because the numbers are the
 * content of this tool.
 */
export function Field({ label, children, hint, value }: FieldProps) {
    return (
        <label className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between">
                <span className="text-[13px] text-fog">{label}</span>
                {value !== undefined && (
                    <span className="tabular text-[12px] text-[#e6e8eb]">{value}</span>
                )}
            </span>
            {children}
            {hint && <span className="text-[11px] leading-snug text-[#5c6670]">{hint}</span>}
        </label>
    );
}

interface NumberInputProps {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function NumberInput({ value, onChange, min, max, step = 1 }: NumberInputProps) {
    return (
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) onChange(v);
            }}
            className="tabular w-full border border-line bg-ink-2 px-3 py-2 text-sm text-[#e6e8eb] outline-none transition focus:border-mint"
        />
    );
}

interface SliderProps {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function Slider({ value, onChange, min = 0, max = 1, step = 0.01 }: SliderProps) {
    return (
        <input
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full"
        />
    );
}

interface ColorInputProps {
    value: string;
    onChange: (v: string) => void;
}

export function ColorInput({ value, onChange }: ColorInputProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="h-9 w-9 shrink-0 cursor-pointer"
            />
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                spellCheck={false}
                className="tabular w-full border border-line bg-ink-2 px-3 py-2 text-sm text-[#e6e8eb] outline-none transition focus:border-mint"
            />
        </div>
    );
}

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, disabled, variant = 'primary' }: ButtonProps) {
    const base =
        'px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
    const styles =
        variant === 'primary'
            ? 'bg-mint text-ink hover:bg-[#33ffb0]'
            : 'border border-line text-[#e6e8eb] hover:border-fog';
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
            {children}
        </button>
    );
}
