import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { MdAdd, MdBadge, MdCalendarMonth, MdEmail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { getValidatedFormData, useRemixForm } from "remix-hook-form"
import * as zod from "zod"

import Loader from "~/Components/Loader"

import createAccount from "./createAccount"

const schema = zod.object({
    name: zod
        .string()
        .min(3)
        .max(32)
        .trim(),
    firstName: zod
        .string()
        .min(3)
        .max(32)
        .trim(),
    username: zod
        .string()
        .min(3)
        .max(32)
        .trim()
        .regex(/^[a-zA-Z0-9_]+$/),
    birthDate: zod
        .date({
            coerce: true
        })
        .max(new Date()),
    mail: zod
        .string()
        .email()
        .trim()
        .toLowerCase(),
    password: zod
        .string()
        .min(8)
        .max(255),
    passwordConfirmation: zod
        .string()
        .min(8)
        .max(255)
})

type FormData = zod.infer<typeof schema>

const resolver = zodResolver(schema)

export const meta: MetaFunction = () => {
    return [
        { title: "Créer un compte" },
        { name: "description", content: "Créer un compte" },
    ]
}

export async function action({ request }: ActionFunctionArgs) {
    const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<FormData>(request, resolver)

    if (errors) return json({ errors, defaultValues })

    if (data.password !== data.passwordConfirmation) {
        return json({
            errors: {
                passwordConfirmation: {
                    message: "Les mots de passe ne correspondent pas"
                },
                password: {
                    message: "Les mots de passe ne correspondent pas"
                }
            },
            defaultValues
        }, { status: 400 })
    }

    const result = await createAccount({ request, ...data })

    return result
}

export default function Index() {
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        register,
    } = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const inputClass = "flex flex-col justify-center items-start w-11/12 lg:w-1/2"
    const errorClass = "text-red-500 text-center lg:text-left w-full"

    return (
        <Form
            action="/account/register"
            method="post"
            onSubmit={handleSubmit}
            className="bg-slate-700 min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-4"
        >
            <h1 className="text-white text-3xl font-bold text-center flex flex-row items-center justify-center gap-2">
                <MdAdd size={30} />

                Créer un compte
            </h1>

            <div className={inputClass}>
                <label htmlFor="name" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdBadge size={20} />

                    Nom
                </label>
                <input
                    type="text"
                    {...register("name")}
                    id="name"
                    name="name"
                    placeholder="Nom"
                    autoComplete="name"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.name ? <span className={errorClass}>{errors.name.message}</span> : null}
            </div>

            <div className={inputClass}>
                <label htmlFor="firstName" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdBadge size={20} />
                
                    Prénom
                </label>
                <input
                    type="text"
                    {...register("firstName")}
                    id="firstName"
                    name="firstName"
                    placeholder="Prénom"
                    autoComplete="given-name"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.firstName ? <span className={errorClass}>{errors.firstName.message}</span> : null}
            </div>

            <div className={inputClass}>
                <label htmlFor="username" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdBadge size={20} />

                    Pseudo
                </label>
                <input
                    type="text"
                    {...register("username")}
                    id="username"
                    name="username"
                    placeholder="Pseudo"
                    autoComplete="username"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.username ? <span className={errorClass}>{errors.username.message}</span> : null}
            </div>

            <div className={inputClass}>
                <label htmlFor="birthDate" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdCalendarMonth size={20} />

                    Date de naissance
                </label>
                <input
                    type="date"
                    {...register("birthDate", { valueAsDate: true })}
                    id="birthDate"
                    name="birthDate"
                    placeholder="Date de naissance"
                    autoComplete="bday-day bday-month bday-year"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.birthDate ? <span className={errorClass}>{errors.birthDate.message}</span> : null}
            </div>


            <div className={inputClass}>
                <label htmlFor="mail" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdEmail size={20} />
                
                    Email
                </label>
                <input
                    type="mail"
                    {...register("mail")}
                    id="mail"
                    name="mail"
                    placeholder="Email"
                    autoComplete="email"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.mail ? <span className={errorClass}>{errors.mail.message}</span> : null}
            </div>

            <div className={inputClass}>
                <label htmlFor="password" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdPassword size={20} />
                
                    Mot de passe
                </label>
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        id="password"
                        name="password"
                        placeholder="Mot de passe"
                        autoComplete="new-password"
                        className="bg-slate-800 text-white p-2 rounded w-full"
                    />
                    <ShowButton show={showPassword} setShow={setShowPassword} />
                </div>

                {errors.password ? <span className={errorClass}>{errors.password.message}</span> : null}
            </div>

            <div className={inputClass}>
                <label htmlFor="passwordConfirmation" className="text-white flex flex-row items-center justify-center gap-2">
                    <MdPassword size={20} />
                
                    Confirmation du mot de passe
                </label>
                <div className="relative w-full">
                    <input
                        type={showPasswordConfirmation ? "text" : "password"}
                        {...register("passwordConfirmation")}
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        placeholder="Confirmation du mot de passe"
                        autoComplete="new-password"
                        className="bg-slate-800 text-white p-2 rounded w-full"
                    />
                    <ShowButton show={showPasswordConfirmation} setShow={setShowPasswordConfirmation} />
                </div>

                {errors.passwordConfirmation ? <span className={errorClass}>{errors.passwordConfirmation.message}</span> : null}
            </div>

            <a href="/account/login" className="text-white underline hover:text-slate-400 text-center">Déjà un compte ? Connectez-vous</a>

            <button
                type="submit"
                className={`${isSubmitting ? "opacity-50" : "hover:bg-green-700"} bg-green-500 text-white p-4 rounded flex flex-row justify-center items-center gap-2`}
                disabled={isSubmitting}
            >
                <MdAdd size={20} className={`${isSubmitting ? "hidden" : "block"}`} />
                <Loader className={`${isSubmitting ? "block" : "hidden"} w-5 h-5`}></Loader>

                Créer un compte
            </button>
        </Form>
    )
}

const ShowButton = ({ show, setShow }: { show: boolean, setShow: (show: boolean) => void }) => {
    return (
        <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-white absolute right-0 top-0 bottom-0 mr-3 hover:text-slate-400"
            aria-label="Afficher le mot de passe"
        >
            <MdVisibility size={20} className={`${show ? "hidden" : "block"}`} />
            <MdVisibilityOff size={20} className={`${show ? "block" : "hidden"}`} />
        </button>
    )
}