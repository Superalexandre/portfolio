import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { getUser } from "~/session.server"

export async function loader({ request }: ActionFunctionArgs) {
    const profile = await getUser(request)
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
        <div className="flex flex-row justify-center w-full" >
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
    )
} 