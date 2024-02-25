import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { MdContentCopy, MdOpenInNew, MdSend } from "react-icons/md"

import { getUser } from "~/session.server"

import createMessage from "./createMessage"
import type { Ambiance, BackgroundColor } from "./createMessage"

export const meta: MetaFunction = () => {
    return [
        { title: "Créer un message secret" },
        { name: "description", content: "Créer votre propre message secret !" },
    ]
}

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData()
    const message = body.get("message")
    const author = body.get("author")

    if (!message) return json({
        success: false,
        error: true,
        message: "Merci d'écrire un message",
        id: null
    })

    const stringMessage = message.toString()
    const stringAuthor = author?.toString() || "Anonyme"
    
    const bodyBackgroundColor = body.get("backgroundColor")?.toString() as BackgroundColor
    const backgroundColor: BackgroundColor = bodyBackgroundColor || "dark"

    const bodyAmbiance = body.get("ambiance")?.toString() as Ambiance
    const ambiance: Ambiance = bodyAmbiance || "normal"
    
    const isQuestion = body.get("isQuestion") === "on"

    if (stringMessage.length <= 0) return json({
        success: false,
        error: true,
        message: "Message trop court",
        id: null
    })

    if (stringMessage.length > 2048) return json({
        success: false,
        error: true,
        message: "Message trop long",
        id: null
    })

    const account = await getUser(request)
    const result = createMessage(stringMessage, stringAuthor, account, { isQuestion, ambiance, backgroundColor })

    return json({
        success: true,
        error: false,
        message: result.message,
        id: result.id
    })
}

export default function Index() {
    const result = useActionData<typeof action>()
    const navigation = useNavigation()

    const isLoading = navigation.state === "submitting"

    const copyToClipboard = (id: string) => {
        const url = `${window.location.origin}/secretMessage/${id}`
        navigator.clipboard.writeText(url)
    }

    return (
        <Form
            method="post"
            action="/secretMessage"
            className="bg-slate-700 min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-4"
        >
            <textarea
                name="message"
                id="message"
                className="bg-slate-800 text-white p-5 rounded-lg w-11/12 lg:w-1/2 h-96"
                placeholder="Entrez votre message secret"
            >
            </textarea>

            <input type="text" name="author" id="author" className="bg-slate-800 text-white p-5 rounded-lg w-11/12 lg:w-1/2" placeholder="Entrez votre nom (vide si Anonyme)" />

            <select name="backgroundColor" id="backgroundColor" className="bg-slate-800 text-white p-5 rounded-lg w-11/12 lg:w-1/2">
                <option value="dark">Fond sombre</option>
                <option value="white">Fond blanc</option>
                <option value="pink">Fond rose</option>
            </select>

            <select name="ambiance" id="ambiance" className="bg-slate-800 text-white p-5 rounded-lg w-11/12 lg:w-1/2">
                <option value="normal">Normal</option>
                <option value="confetti">Confetti</option>
                <option value="love">Love</option>
                <option value="rain">Pluie</option>
            </select>

            
            {/* 
            <div className="flex justify-center items-center gap-2 flex-row w-11/12 lg:w-1/2">
                <input type="checkbox" name="isQuestion" id="isQuestion" className="bg-slate-800 text-white p-5 rounded-lg" />
                <label htmlFor="isQuestion" className="text-white">{"C'est une question"}</label>
            </div> 
            */}

            <button 
                type="submit" 
                className={`${isLoading ? "opacity-50" : "hover:bg-green-700 "} bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 p-4`}
                disabled={isLoading}
            >
                <div className={`${isLoading ? "block" : "hidden"} loader w-5 h-5`}></div>
                <MdSend size={20} className={`${isLoading ? "hidden" : "block"}`} />
             
                Envoyer
            </button>
            <div className="flex items-center justify-center flex-col">
                {result?.success ? <p className="text-green-500">{result.message}</p> : null}
                {result?.id ?
                    <div className="flex items-center justify-center flex-col lg:flex-row gap-6 lg:gap-2">
                        <p className="text-green-500">ID: {result.id}</p>

                        <button 
                            className="text-green-500 flex flex-row gap-2"
                            onClick={() => copyToClipboard(result.id)}
                            type="button"
                        >
                            <p className="block lg:hidden">Copié</p>
                            <MdContentCopy size={20} />
                        </button>

                        <a 
                            className="text-green-500 flex flex-row gap-2"
                            href={`/secretMessage/${result.id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className="block lg:hidden">Ouvrir le lien</p>
                            <MdOpenInNew size={20} />
                        </a>
                    </div>
                    : null}
                {result?.error ? <p className="text-red-500 text-center">{result.message}</p> : null}
            </div>
        </Form>
    )
}