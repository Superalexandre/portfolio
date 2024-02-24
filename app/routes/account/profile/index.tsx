import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { MdLogout } from "react-icons/md"

import { getUserToken } from "~/session.server"

import getProfile from "./getProfile"

export async function loader({ request }: ActionFunctionArgs) {
    const session = await getUserToken(request)
    if (!session) return redirect("/account/login")

    const profile = await getProfile(session)
    if (!profile) return redirect("/account/login")

    return json({
        profile
    })
}

export default function Index() {
    const { profile } = useLoaderData<typeof loader>()

    const date = new Date()
    const greeting = date.getHours() < 12 ? "Bonjour," : "Bonsoir,"

    return (
        <div className="bg-slate-700 min-w-full h-full min-h-screen flex flex-row">
            <SideBar />

            <div className="flex flex-row justify-center w-full">
                <div className="flex flex-col items-center gap-4 m-4">
                    <img
                        src={`https://api.dicebear.com/7.x/bottts/png?seed=${profile.avatarSeed}`}
                        alt={`${profile.username} avatar`}
                        className="w-24 h-24 rounded-full"
                    />

                    <h1 className="text-2xl text-center text-white">
                        {greeting} {profile.username}
                    </h1>
                </div>
            </div>
        </div>
    )
}

const SideBar = () => {
    return (
        <div className="bg-slate-800 w-52 h-auto flex flex-col justify-between items-center py-4">
            <div className="h-auto flex flex-col gap-4 items-center justify-center">
                <p className="text-center text-white">Mes messages</p>
                <p className="text-center text-white">Paramètres</p>
            </div>
            <Form action="/account/logout" method="post">
                <button type="submit" className="text-center text-white flex flex-row items-center justify-center gap-2">
                    <MdLogout />

                    Déconnexion
                </button>
            </Form>
        </div>
    )
}