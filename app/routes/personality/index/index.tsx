/*
    TODO: Add the next personage
    - Shrek
    - Toy Story
    - Friends
    - Harry Potter
    - The office
*/

import { ActionFunctionArgs } from "@remix-run/node"
import { json, useLoaderData, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { MdArrowForward } from "react-icons/md"

import QuestionFile from "@/types/personality/QuestionFile"
import User from "@/types/User"
import { PopupAccount } from "~/Components/PopupAccount"
import { getUser } from "~/session.server"

import { getPersonalities } from "./getPersonalities"

export const handle = { i18n: "common" }
export async function loader({ request }: ActionFunctionArgs) {
    const personalities = getPersonalities()
    const user = await getUser(request)

    return json({
        personalities,
        user
    })
}

export default function Index() {
    const { personalities, user } = useLoaderData<typeof loader>()

    const [popupAccountHidden, setPopupAccountHidden] = useState(true)
    const [personality, setPersonality] = useState(personalities[0].name)

    const navigate = useNavigate()
    const redirect = `/personality/${personality}`

    return (
        <>
            <PopupAccount 
                hidden={popupAccountHidden} 
                setHidden={() => setPopupAccountHidden(!popupAccountHidden)} 
                title={"Crée ton compte pour sauvegarder tes résultats"}
                redirect={redirect}
            />

            <FormPersonalities 
                personalities={personalities} 
                setPersonality={setPersonality}
                setPopupAccountHidden={setPopupAccountHidden}
                user={user}
                navigate={() => navigate(redirect)}
            />
        </>
    )
}

interface FormPersonalitiesProps {
    personalities: QuestionFile[]
    setPersonality: (personality: string) => void
    setPopupAccountHidden: (hidden: boolean) => void
    user: User | null
    navigate: () => void
}

const FormPersonalities = ({ personalities, setPersonality, setPopupAccountHidden, user, navigate }: FormPersonalitiesProps) => {
    return (
        <div
            className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-64 bg-slate-700"
        >
            <div className="flex flex-col items-center justify-center gap-4">
                <label htmlFor="personality" className="text-white">
                    Choisis l’univers ou tu veux découvrir qui tu es
                </label>
                <select 
                    name="personality" 
                    className="rounded-md bg-slate-800 p-2 text-white"
                    onChange={e => setPersonality(e.target.value)}
                >
                    {personalities.map(personality => (
                        <option key={personality.name} value={personality.name}>{personality.prettyName}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-bold text-center text-white">
                        Le test devrait prendre ~10 min
                    </p>
                    <p className="text-bold text-center text-white">
                        Prêt ?
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (!user) return setPopupAccountHidden(false)

                        navigate()
                    }}
                    className={"flex flex-row items-center justify-center gap-2 rounded-lg bg-green-500 p-4 text-white hover:bg-green-800"}
                >
                    Commencer

                    <MdArrowForward />
                </button>
            </div>
        </div>
    )
}