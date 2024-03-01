import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { FieldErrors } from "react-hook-form"
import { MdLogin, MdMail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { getValidatedFormData, useRemixForm } from "remix-hook-form"
import * as zod from "zod"

import { InputForm } from "~/Components/Input"

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

export const meta: MetaFunction = () => {
    return [
        { title: "Connexion" },
        { name: "description", content: "Connectez vous !" },
    ]
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

    return (
        <Form
            action="/account/login"
            method="post"
            onSubmit={handleSubmit}
            className="bg-slate-700 min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-4"
        >
            <h1 className="text-white text-3xl font-bold text-center flex flex-row items-center justify-center gap-2">
                <MdLogin size={30} />

                Se connecter
            </h1>

            <InputForm
                type="text"
                name="mailOrUsername"
                id="mailOrUsername"
                placeholder="Email ou pseudo"
                autoComplete="username email"
                errors={errors as FieldErrors}
                register={register}
                Icon={MdMail}
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

            <a href="/account/register" className="text-white underline hover:text-slate-400 text-center">
                Pas encore de compte ? Inscrivez-vous !
            </a>
            {/* <a href="/account/forgot-password" className="text-white underline hover:text-slate-400 text-center">Mot de passe oublié ?</a> */}

            <button
                type="submit"
                className={`${isSubmitting ? "opacity-50" : "hover:bg-green-700"} bg-green-500 text-white p-4 rounded flex flex-row justify-center items-center gap-2`}
                disabled={isSubmitting}
            >
                <MdLogin size={20} className={`${isSubmitting ? "hidden" : "block"}`} />
                <div className={`${isSubmitting ? "block" : "hidden"} loader w-5 h-5`}></div>

                Se connecter
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