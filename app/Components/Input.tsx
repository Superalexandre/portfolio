import { HTMLInputTypeAttribute } from "react"
import { FieldErrors } from "react-hook-form"
import { IconType } from "react-icons"
// import { MdMail } from "react-icons/md"

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
    errors?: FieldErrors<{
        [key: string]: {
            message: string
        }
    }>
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
            className={`bg-slate-800 text-white p-2 rounded w-full ${className}`}
        />
    )
}

export function InputForm({ parentClass, errorClass, type = "text", placeholder, autoComplete, className, id, name, Icon, errors, register, ShowButton }: InputFormProps) {
    return (
        <div className={`flex flex-col justify-center items-start w-11/12 lg:w-1/2 ${parentClass}`}>
            <label htmlFor={name} className="text-white flex flex-row items-center justify-center gap-2">
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
                <span className={`text-red-500 text-center lg:text-left w-full ${errorClass}`}>
                    {errors[name]?.message?.toString()}
                </span>
                : null}
        </div>
    )
}