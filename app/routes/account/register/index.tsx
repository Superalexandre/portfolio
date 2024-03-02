import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdAdd, MdBadge, MdCalendarMonth, MdEmail, MdPassword } from "react-icons/md"
import { getValidatedFormData, useRemixForm } from "remix-hook-form"
import * as zod from "zod"

import type { FieldErrors } from "@/types/forms/FieldErrors"
import { InputForm } from "~/Components/Input"
import Loader from "~/Components/Loader"
import ShowButton from "~/Components/ShowHiddenButton"
import i18next from "~/i18next.server"
import getLanguage from "~/utils/getLanguage"

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

export const handle = { i18n: "common" }
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title },
        { name: "description", content: data?.description },
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const language = getLanguage(request)
    const t = await i18next.getFixedT(language, null, "common")

    const title = t("register.meta.title")
    const description = t("register.meta.description")

    return { title, description }
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
    const { t } = useTranslation("common")
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
            className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-4 bg-slate-700"
        >
            <h1 className="flex flex-row items-center justify-center gap-2 text-center text-3xl font-bold text-white">
                <MdAdd size={30} />

                {t("register.title")}
            </h1>

            <InputForm
                type="text"
                name="name"
                id="name"
                placeholder={t("register.name")}
                autoComplete="name"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdBadge}
            />

            <InputForm
                type="text"
                name="firstName"
                id="firstName"
                placeholder={t("register.firstName")}
                autoComplete="given-name"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdBadge}
            />

            <InputForm
                type="text"
                name="username"
                id="username"
                placeholder={t("register.username")}
                autoComplete="username"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdBadge}
            />

            <InputForm
                type="date"
                name="birthDate"
                id="birthDate"
                placeholder={t("register.birthDate")}
                autoComplete="bday-day bday-month bday-year"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdCalendarMonth}
            />

            <InputForm
                type="mail"
                name="mail"
                id="mail"
                placeholder={t("register.mail")}
                autoComplete="email"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdEmail}
            />

            <InputForm
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder={t("register.password")}
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
                placeholder={t("register.confirmPassword")}
                autoComplete="new-password"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdPassword}
                ShowButton={<ShowButton show={showPasswordConfirmation} setShow={setShowPasswordConfirmation} />}
            />

            <a href="/account/login" className="text-center text-white underline hover:text-slate-400">
                {t("register.alreadyHaveAnAccount")}
            </a>

            <button
                type="submit"
                className={`${isSubmitting ? "opacity-50" : "hover:bg-green-700"} flex flex-row items-center justify-center gap-2 rounded bg-green-500 p-4 text-white`}
                disabled={isSubmitting}
            >
                <MdAdd size={20} className={`${isSubmitting ? "hidden" : "block"}`} />
                <Loader className={`${isSubmitting ? "block" : "hidden"} h-5 w-5`}></Loader>

                {t("register.createAccount")}
            </button>
        </Form>
    )
}