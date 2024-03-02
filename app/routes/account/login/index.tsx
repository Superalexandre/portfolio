import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdLogin, MdMail, MdPassword } from "react-icons/md"
import { getValidatedFormData, useRemixForm } from "remix-hook-form"
import * as zod from "zod"

import type { FieldErrors } from "@/types/forms/FieldErrors"
import { InputForm } from "~/Components/Input"
import ShowButton from "~/Components/ShowHiddenButton"
import i18next from "~/i18next.server"
import getLanguage from "~/utils/getLanguage"

import login from "./login"

const schema = zod.object({
    mailOrUsername: zod
        .string()
        .trim()
        .min(3)
        .max(255),
    password: zod
        .string()
        .min(8)
        .max(255),
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

    const title = t("login.meta.title")
    const description = t("login.meta.description")

    return { title, description }
}
export async function action({ request }: ActionFunctionArgs) {
    const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<FormData>(request, resolver)

    if (errors) return json({ errors, defaultValues })

    const result = await login({ request, ...data })

    return result
}

export default function Index() {
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        register,
    } = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver,
    })

    const [showPassword, setShowPassword] = useState(false)

    const { t } = useTranslation("common")

    return (
        <Form
            action="/account/login"
            method="post"
            onSubmit={handleSubmit}
            className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-4 bg-slate-700"
        >
            <h1 className="flex flex-row items-center justify-center gap-2 text-center text-3xl font-bold text-white">
                <MdLogin size={30} />

                {t("login.title")}
            </h1>

            <InputForm
                type="text"
                name="mailOrUsername"
                id="mailOrUsername"
                placeholder={t("login.mailOrPassword")}
                autoComplete="username email"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdMail}
            />

            <InputForm
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder={t("login.password")}
                autoComplete="new-password"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdPassword}
                ShowButton={<ShowButton show={showPassword} setShow={setShowPassword} />}
            />

            <a href="/account/register" className="text-center text-white underline hover:text-slate-400">
                {t("login.noAccount")}
            </a>
            {/* <a href="/account/forgot-password" className="text-white underline hover:text-slate-400 text-center">Mot de passe oublié ?</a> */}

            <button
                type="submit"
                className={`${isSubmitting ? "opacity-50" : "hover:bg-green-700"} flex flex-row items-center justify-center gap-2 rounded bg-green-500 p-4 text-white`}
                disabled={isSubmitting}
            >
                <MdLogin size={20} className={`${isSubmitting ? "hidden" : "block"}`} />
                <div className={`${isSubmitting ? "block" : "hidden"} loader h-5 w-5`}></div>

                {t("login.connection")}
            </button>
        </Form>
    )
}