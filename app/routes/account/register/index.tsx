import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, json } from "@remix-run/node"
import { Form, /* useActionData, */ useNavigation } from "@remix-run/react"
import { useState } from "react"
import { MdAdd, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { getValidatedFormData, useRemixForm } from "remix-hook-form"
import * as zod from "zod"

const schema = zod.object({
    name: zod
        .string()
        .min(3)
        .max(32),
    firstName: zod
        .string()
        .min(3)
        .max(32),
    username: zod
        .string()
        .min(3)
        .max(32),
    mail: zod
        .string()
        .email(),
    password: zod
        .string()
        .min(8)
        .max(255),
    passwordConfirmation: zod
        .string()
        .min(8)
        .max(255),
})

type FormData = zod.infer<typeof schema>

const resolver = zodResolver(schema)


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
        })
    }

    console.log(data)

    return json({ success: true, error: false, message: "Hello World" })
}

export default function Index() {
    // const result = useActionData<typeof action>()
    const navigation = useNavigation()

    const isLoading = navigation.state === "submitting"

    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useRemixForm<FormData>({
        mode: "onSubmit",
        resolver,
        submitConfig: {
            action: "/account/register",
            method: "post",
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const inputClass = "flex flex-col justify-center items-start w-11/12 lg:w-1/2"

    // console.log("result", result)

    return (
        <Form
            onSubmit={handleSubmit}
            className="bg-slate-700 min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-4"
        >
            <h1 className="text-white text-3xl font-bold text-center">Créer un compte</h1>

            <div className={inputClass}>
                <label htmlFor="name" className="text-white">Nom</label>
                <input
                    {...register("name")}
                    type="text"
                    name="name"
                    placeholder="Nom"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </div>

            <div className={inputClass}>
                <label htmlFor="firstName" className="text-white">Prénom</label>
                <input
                    {...register("firstName")}
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
            </div>

            <div className={inputClass}>
                <label htmlFor="username" className="text-white">Pseudo</label>
                <input
                    {...register("username")}
                    type="text"
                    name="username"
                    placeholder="Pseudo"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.username && <span className="text-red-500">{errors.username.message}</span>}
            </div>

            <div className={inputClass}>
                <label htmlFor="mail" className="text-white">Email</label>
                <input
                    {...register("mail")}
                    type="mail"
                    name="mail"
                    placeholder="Email"
                    className="bg-slate-800 text-white p-2 rounded w-full"
                />
                {errors.mail && <span className="text-red-500">{errors.mail.message}</span>}
            </div>

            <div className={inputClass}>
                <label htmlFor="password" className="text-white">Mot de passe</label>
                <div className="relative w-full">
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mot de passe"
                        className="bg-slate-800 text-white p-2 rounded w-full"
                    />
                    <ShowButton show={showPassword} setShow={setShowPassword} />
                </div>

                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <div className={inputClass}>
                <label htmlFor="passwordConfirmation" className="text-white">Confirmation du mot de passe</label>
                <div className="relative w-full">
                    <input
                        {...register("passwordConfirmation")}
                        type={showPasswordConfirmation ? "text" : "password"}
                        name="passwordConfirmation"
                        placeholder="Confirmation du mot de passe"
                        className="bg-slate-800 text-white p-2 rounded w-full"
                    />
                    <ShowButton show={showPasswordConfirmation} setShow={setShowPasswordConfirmation} />
                </div>

                {errors.passwordConfirmation && <span className="text-red-500">{errors.passwordConfirmation.message}</span>}
            </div>

            <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded flex flex-row justify-center items-center gap-4"
                disabled={isLoading}
            >
                <MdAdd size={20} className={`${isLoading ? "hidden" : "block"}`} />
                <div className={`${isLoading ? "block" : "hidden"} loader w-5 h-5`}></div>

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
            className="text-white absolute right-0 top-0 bottom-0 m-3"
        >
            <MdVisibility size={20} className={`${show ? "hidden" : "block"}`} />
            <MdVisibilityOff size={20} className={`${show ? "block" : "hidden"}`} />
        </button>
    )
}