import { HTMLInputTypeAttribute } from "react"
import { IconType } from "react-icons"

import type { FieldErrors } from "@/types/forms/FieldErrors"
interface InputProps {
    type: HTMLInputTypeAttribute
    placeholder: string | undefined
    autoComplete: string | undefined
    className: string | undefined
    id: string | undefined
    name: string | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any
}

interface InputFormProps {
    parentClass?: string
    errorClass?: string
    type: HTMLInputTypeAttribute
    placeholder?: string | undefined
    autoComplete?: string | undefined
    className?: string | undefined
    id?: string | undefined
    name?: string | undefined
    Icon?: IconType
    errors?: FieldErrors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register?: any
    ShowButton?: JSX.Element
}

export default function Input({ type = "text", placeholder, autoComplete, className, id, name, register }: InputProps) {
    return (
        <input
            type={type}
            {...register(name)}
            id={id}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`w-full rounded bg-slate-800 p-2 text-white ${className}`}
        />
    )
}

export function InputForm({ parentClass, errorClass, type = "text", placeholder, autoComplete, className, id, name, Icon, errors, register, ShowButton }: InputFormProps) {
    return (
        <div className={`flex w-11/12 flex-col items-start justify-center lg:w-1/2 ${parentClass}`}>
            <label htmlFor={name} className="flex flex-row items-center justify-center gap-2 text-white">
                {Icon ? <Icon size={20} /> : null}

                {placeholder}
            </label>

            <div className="relative w-full">
                <Input 
                    type={type} 
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={className}
                    id={id}
                    name={name}
                    register={register}
                />

                {ShowButton}
            </div>

            {errors && name && errors[name] ?
                <span className={`w-full text-center text-red-500 lg:text-left ${errorClass}`}>
                    {errors[name]?.message?.toString()}
                </span>
                : null}
        </div>
    )
}