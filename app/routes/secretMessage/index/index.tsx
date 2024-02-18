import { ActionFunctionArgs, json } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { MdContentCopy, MdOpenInNew } from "react-icons/md"

import createMessage from "./createMessage"

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
    const backgroundColor: any = body.get("backgroundColor")?.toString() || "dark"
    const ambiance: any = body.get("ambiance")?.toString() || "normal"
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

    const result = createMessage(stringMessage, stringAuthor, { isQuestion, ambiance, backgroundColor })

    return json({
        success: true,
        error: false,
        message: result.message,
        id: result.id
    })
}

export default function Index() {
    const result = useActionData<typeof action>()

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
                className="bg-slate-800 text-white p-5 rounded-lg w-1/2 h-96"
                placeholder="Entrez votre message secret"
            >
            </textarea>

            <input type="text" name="author" id="author" className="bg-slate-800 text-white p-5 rounded-lg w-1/2" placeholder="Entrez votre nom (vide si Anonyme)" />

            <select name="backgroundColor" id="backgroundColor" className="bg-slate-800 text-white p-5 rounded-lg w-1/2">
                <option value="dark">Fond sombre</option>
                <option value="white">Fond blanc</option>
                <option value="pink">Fond rose</option>
            </select>

            <select name="ambiance" id="ambiance" className="bg-slate-800 text-white p-5 rounded-lg w-1/2">
                <option value="normal">Normal</option>
                <option value="confetti">Confetti</option>
                <option value="love">Love</option>
                <option value="rain">Pluie</option>
            </select>

            
            {/* 
            <div className="flex justify-center items-center gap-2 flex-row w-1/2">
                <input type="checkbox" name="isQuestion" id="isQuestion" className="bg-slate-800 text-white p-5 rounded-lg" />
                <label htmlFor="isQuestion" className="text-white">{"C'est une question"}</label>
            </div> 
            */}

            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Envoyer</button>
            <div className="flex items-center justify-center flex-col">
                {result?.success ? <p className="text-green-500">{result.message}</p> : null}
                {result?.id ?
                    <div className="flex items-center justify-center flex-row gap-2">
                        <p className="text-green-500">ID: {result.id}</p>

                        <MdContentCopy size={21} className="text-green-500 cursor-pointer" onClick={() => copyToClipboard(result.id)} />
                        <MdOpenInNew size={21} className="text-green-500 cursor-pointer" onClick={() => window.open(`/secretMessage/${result.id}`)} />
                    </div>
                    : null}
                {result?.error ? <p className="text-red-500 text-center">{result.message}</p> : null}
            </div>
        </Form>
    )
}