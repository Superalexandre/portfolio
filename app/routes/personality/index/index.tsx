/*
    TODO: Add the next personage
    - Shrek
    - Toy Story
    - Friends
    - Harry Potter
    - The office
*/

import { ActionFunctionArgs } from "@remix-run/node"
import { Form, json, useLoaderData, redirect } from "@remix-run/react"
import { MdArrowForward } from "react-icons/md"

import { getPersonalities } from "./getPersonalities"

export function loader() {
    const personalities = getPersonalities()
    
    return json({
        personalities
    })
}

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData()
    const personality = body.get("personality")

    if (!personality) return json({
        success: false,
        error: true,
        message: "Tu dois choisir un univers"
    })

    return redirect(`/personality/${personality}`)
}

export default function Index() {
    const { personalities } = useLoaderData<typeof loader>()

    return (
        <Form
            method="post"
            action="/personality"
            className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-64 bg-slate-700"
        >
            <div className="flex flex-col items-center justify-center gap-4">
                <label htmlFor="personality" className="text-white">
                    Choisis l’univers ou tu veux découvrir qui tu es
                </label>
                <select name="personality" className="rounded-md bg-slate-800 p-2 text-white">
                    {personalities.map(personality => (
                        <option key={personality.name} value={personality.name}>{personality.prettyName}</option>
                    ))}
                    {/* <option value="barbie">Barbie</option>
                    <option value="cars">Cars</option>
                    <option value="nemo">Nemo</option>
                    <option value="simpsons">Simpsons</option>
                    <option value="starwars">Star Wars</option>
                    <option value="thewalkingdead">The Walking Dead</option> */}
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
                    type="submit"
                    className={"flex flex-row items-center justify-center gap-2 rounded-lg bg-green-500 p-4 text-white hover:bg-green-800"}
                >
                    Commencer

                    <MdArrowForward />
                </button>

            </div>
        </Form>
    )
}