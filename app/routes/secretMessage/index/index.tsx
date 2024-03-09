import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { TFunction } from "i18next"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { MdContentCopy, MdDone, MdOpenInNew, MdSend } from "react-icons/md"

import Loader from "~/Components/Loader"
import { PopupAccount } from "~/Components/PopupAccount"
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard"
import i18next from "~/i18next.server"
import { getUser } from "~/session.server"
import getLanguage from "~/utils/getLanguage"

import createMessage from "./createMessage"
import type { Ambiance, BackgroundColor } from "./createMessage"

export const handle = { i18n: "common" }
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title },
        { name: "description", content: data?.description },
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request)

    const language = getLanguage(request)
    const t = await i18next.getFixedT(language, null, "common")

    const title = t("secretMessage.meta.title")
    const description = t("secretMessage.meta.description")

    return { user, title, description }
}

export async function action({ request }: ActionFunctionArgs) {
    const language = getLanguage(request)
    const t = await i18next.getFixedT(language, null, "common")

    const body = await request.formData()
    const message = body.get("message")
    const author = body.get("author")

    if (!message) return json({
        success: false,
        error: true,
        message: t("secretMessage.writeMessage") as string,
        id: null
    })

    const stringMessage = message.toString()
    const stringAuthor = author?.toString() || t("secretMessage.anonymous")

    const bodyBackgroundColor = body.get("backgroundColor")?.toString() as BackgroundColor
    const backgroundColor: BackgroundColor = bodyBackgroundColor || "dark"

    const bodyAmbiance = body.get("ambiance")?.toString() as Ambiance
    const ambiance: Ambiance = bodyAmbiance || "normal"

    const isQuestion = body.get("isQuestion") === "on"

    if (stringMessage.length <= 0) return json({
        success: false,
        error: true,
        message: t("secretMessage.tooShort") as string,
        id: null
    })

    if (stringMessage.length > 2048) return json({
        success: false,
        error: true,
        message: t("secretMessage.tooLong") as string,
        id: null
    })

    const account = await getUser(request)
    const result = await createMessage(stringMessage, stringAuthor, account, { isQuestion, ambiance, backgroundColor })

    return json({
        success: true,
        error: false,
        message: result.message,
        id: result.id
    })
}

export default function Index() {
    const { t } = useTranslation("common")
    const { user } = useLoaderData<typeof loader>()
    const result = useActionData<typeof action>()
    const navigation = useNavigation()

    const isLoading = navigation.state === "submitting"

    const [popupAccountHidden, setPopupAccountHidden] = useState(true)

    useEffect(() => {
        if (!user) setPopupAccountHidden(false)
    }, [])

    return (
        <>
            <PopupAccount
                hidden={popupAccountHidden}
                setHidden={() => setPopupAccountHidden(!popupAccountHidden)}
                title="Crée ton compte pour sauvegarder tes messages secrets"
                redirect="/secretMessage"
                redirectOnClose={false}
            />

            <InputForm
                t={t}
                isLoading={isLoading}
                result={result as Result}
            />
        </>
    )
}


type Result = {
    success: boolean,
    error: boolean,
    message: string,
    id: string | null
}
interface InputFormProps {
    t: TFunction,
    isLoading: boolean,
    result: Result | undefined
}

const InputForm = ({ t, isLoading, result }: InputFormProps) => {
    const [, copy] = useCopyToClipboard()
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = () => {
        if (!result?.id) return

        copy(`${window.location.origin}/secretMessage/${result.id}`).then((success) => {
            if (success) {
                setIsCopied(true)

                setTimeout(() => {
                    setIsCopied(false)
                }, 3000)
            }
        })
    }

    return (
        <Form
            method="post"
            action="/secretMessage"
            className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-4 bg-slate-700 py-4 lg:p-0"
        >
            <textarea
                name="message"
                id="message"
                className="h-96 w-11/12 rounded-lg bg-slate-800 p-5 text-white lg:w-1/2"
                placeholder={t("secretMessage.messagePlaceholder")}
            >
            </textarea>

            <input type="text" name="author" id="author" className="w-11/12 rounded-lg bg-slate-800 p-5 text-white lg:w-1/2" placeholder={t("secretMessage.namePlaceholder")} />

            <select name="backgroundColor" id="backgroundColor" className="w-11/12 rounded-lg bg-slate-800 p-5 text-white lg:w-1/2">
                <option value="dark">{t("secretMessage.darkTheme")}</option>
                <option value="white">{t("secretMessage.lightTheme")}</option>
                <option value="pink">{t("secretMessage.pinkTheme")}</option>
            </select>

            <select name="ambiance" id="ambiance" className="w-11/12 rounded-lg bg-slate-800 p-5 text-white lg:w-1/2">
                <option value="normal">{t("secretMessage.normalAmbiance")}</option>
                <option value="confetti">{t("secretMessage.confettiAmbiance")}</option>
                <option value="love">{t("secretMessage.loveAmbiance")}</option>
                <option value="rain">{t("secretMessage.rainAmbiance")}</option>
            </select>

            {/* 
            <div className="flex justify-center items-center gap-2 flex-row w-11/12 lg:w-1/2">
                <input type="checkbox" name="isQuestion" id="isQuestion" className="bg-slate-800 text-white p-5 rounded-lg" />
                <label htmlFor="isQuestion" className="text-white">{"C'est une question"}</label>
            </div> 
            */}

            <button
                type="submit"
                className={`${isLoading ? "opacity-50" : "hover:bg-green-700 "} flex items-center justify-center gap-2 rounded-lg bg-green-500 p-4 font-bold text-white`}
                disabled={isLoading}
            >
                <Loader className={`${isLoading ? "block" : "hidden"} h-5 w-5`}></Loader>

                <MdSend size={20} className={`${isLoading ? "hidden" : "block"}`} />

                {t("secretMessage.send")}
            </button>
            <div className="flex flex-col items-center justify-center">
                {result?.success ? <p className="text-green-500">{result.message}</p> : null}
                {result?.id ?
                    <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-2">
                        <p className="text-green-500">ID: {result.id}</p>

                        <button
                            className="flex flex-row items-center justify-center gap-2 text-green-500"
                            onClick={handleCopy}
                            type="button"
                        >
                            <p className="block lg:hidden">{t("secretMessage.copy")}</p>

                            {isCopied ?
                                <MdDone size={20} /> :
                                <MdContentCopy size={20} />
                            }
                        </button>

                        <Link
                            className="flex flex-row items-center justify-center gap-2 text-green-500"
                            to={`/secretMessage/${result.id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className="block lg:hidden">{t("secretMessage.openLink")}</p>
                            <MdOpenInNew size={20} />
                        </Link>
                    </div>
                    : null}
                {result?.error ? <p className="text-center text-red-500">{result.message}</p> : null}
            </div>
        </Form>
    )
}