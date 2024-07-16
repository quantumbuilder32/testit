
export default function TextAreaInput({ name, value, onInput, label, id, errors, onBlur, placeHolder, isOptionalText, rows, ...elProps }: { name: string, value: string, onInput: (e: React.FormEvent<HTMLTextAreaElement>) => void, onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void, label?: string, id?: string, errors?: string, placeHolder?: string, isOptionalText?: string, rows?: number } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps}>
            {label !== undefined && <label htmlFor={id !== undefined ? id : name}>{label}{isOptionalText !== undefined && <span>{isOptionalText}</span>}</label>}

            <textarea rows={rows !== undefined ? rows : 5} id={id !== undefined ? id : name} name={name} value={value} placeholder={placeHolder ?? ""} onInput={onInput} onBlur={(e) => { if (onBlur !== undefined) onBlur(e) }} ></textarea>

            {errors !== undefined && <p style={{ color: "red", fontSize: "var(--smallFontSize)" }}>{errors}</p>}
        </div>
    )
}
