import { zodResolver } from "@hookform/resolvers/zod"
import { Form, Link, useNavigate } from "@remix-run/react"
import { TFunction } from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdArrowForward, MdCancel, MdLogin, MdMail, MdPassword } from "react-icons/md"
import { useRemixForm } from "remix-hook-form"
import * as zod from "zod"

import FieldErrors from "@/types/forms/FieldErrors"

import { InputForm } from "./Input"
import ShowButton from "./ShowHiddenButton"

interface PopupAccountProps {
    hidden: boolean
    setHidden: () => void
    title: string,
    redirect?: string
    redirectOnClose?: boolean
}

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
export function PopupAccount({ hidden, setHidden, title, redirect, redirectOnClose }: PopupAccountProps) {
    const [wantLogin, setWantLogin] = useState(false)

    const form = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver,
        submitConfig: {
            action: `/account/login?redirect=${redirect || ""}`,
            method: "post"
        }
    })
    
    const { t } = useTranslation("common")
    const navigate = useNavigate()

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 ${hidden ? "hidden" : ""}`}
        >
            <PopupWantLogin 
                hidden={!wantLogin} 
                setHidden={() => setWantLogin(false)} 
                setFormHidden={setHidden}
                t={t}
                form={form}
                redirect={redirect}
            />

            <div
                className="m-8 flex flex-col items-center justify-center gap-8 rounded-md bg-slate-700 p-8 lg:m-0"
            >
                <h1 className="text-center text-2xl font-bold text-white">
                    {title}
                </h1>
                <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                    <button
                        type="button"
                        onClick={() => {
                            setHidden()

                            if (redirectOnClose && redirect) navigate(redirect)
                        }}
                        className="flex items-center justify-center gap-2 rounded-md bg-slate-800 p-4 text-white hover:text-black"
                    >
                        Continuer sans compte
                     
                        <MdArrowForward size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setWantLogin(true)}
                        className="flex items-center justify-center gap-2 rounded-md bg-slate-800 p-4 text-white hover:text-black"
                    >
                        {"J'ai déjà un compte"}

                        <MdLogin size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

interface PopupHaveAccountProps {
    hidden: boolean
    setHidden: () => void
    t: TFunction
    form: ReturnType<typeof useRemixForm<FormData>>
    redirect?: string
    setFormHidden: () => void
}

const PopupWantLogin = ({ hidden = true, setHidden, setFormHidden, form, t, redirect }: PopupHaveAccountProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const { handleSubmit, formState: { errors, isSubmitting }, register } = form

    return (
        <Form
            action="/account/login"
            method="post"
            onSubmit={() => {
                handleSubmit()

                setHidden()
                setFormHidden()
            }}
            className={`fixed m-8 flex flex-col items-center justify-center gap-4 rounded-md bg-slate-700 p-8 lg:m-0 ${hidden ? "hidden" : ""} w-auto lg:w-1/2`}
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
                autoComplete="password"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdPassword}
                ShowButton={<ShowButton show={showPassword} setShow={setShowPassword} />}
            />

            <Link 
                to={{
                    pathname: "/account/register",
                    search: redirect ? `?redirect=${redirect}` : ""
                }}
                className="text-center text-white underline hover:text-slate-400"
            >
                {t("login.noAccount")}
            </Link>
            {/* <Link to="/account/forgot-password" className="text-white underline hover:text-slate-400 text-center">Mot de passe oublié ?</Link> */}

            <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                <button
                    type="submit"
                    className={`${isSubmitting ? "opacity-50" : "hover:bg-green-700"} flex flex-row items-center justify-center gap-2 rounded bg-green-500 p-4 text-white`}
                    disabled={isSubmitting}
                >
                    <MdLogin size={20} className={`${isSubmitting ? "hidden" : "block"}`} />
                    <div className={`${isSubmitting ? "block" : "hidden"} loader h-5 w-5`}></div>

                    {t("login.connection")}
                </button>

                <button
                    type="button"
                    onClick={setHidden}
                    className="flex flex-row items-center justify-center gap-2 rounded bg-red-500 p-4 text-white"
                >
                    <MdCancel size={20} />

                    Annuler
                </button>
            </div>
        </Form>
    )
}