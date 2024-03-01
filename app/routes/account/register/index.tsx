import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { FieldErrors } from "react-hook-form"
import { MdAdd, MdBadge, MdCalendarMonth, MdEmail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { getValidatedFormData, useRemixForm } from "remix-hook-form"
import * as zod from "zod"

import { InputForm } from "~/Components/Input"
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

            <InputForm
                type="text"
                name="name"
                id="name"
                placeholder="Nom"
                autoComplete="name"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdBadge}
            />

            <InputForm
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Prénom"
                autoComplete="given-name"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdBadge}
            />

            <InputForm
                type="text"
                name="username"
                id="username"
                placeholder="Pseudo"
                autoComplete="username"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdBadge}
            />

            <InputForm
                type="date"
                name="birthDate"
                id="birthDate"
                placeholder="Date de naissance"
                autoComplete="bday-day bday-month bday-year"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdCalendarMonth}
            />

            <InputForm
                type="mail"
                name="mail"
                id="mail"
                placeholder="Email"
                autoComplete="email"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdEmail}
            />

            <InputForm
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mot de passe"
                autoComplete="new-password"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdPassword}
                ShowButton={<ShowButton show={showPassword} setShow={setShowPassword} />}
            />

            <InputForm
                type={showPasswordConfirmation ? "text" : "password"}
                name="passwordConfirmation"
                id="passwordConfirmation"
                placeholder="Confirmation du mot de passe"
                autoComplete="new-password"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdPassword}
                ShowButton={<ShowButton show={showPasswordConfirmation} setShow={setShowPasswordConfirmation} />}
            />

            <a href="/account/login" className="text-white underline hover:text-slate-400 text-center">
                Déjà un compte ? Connectez-vous
            </a>

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