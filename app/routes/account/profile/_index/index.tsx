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
        <div className="flex w-full flex-row justify-center" >
            <div className="m-4 flex flex-col items-center gap-4">
                <img
                    src={`https://api.dicebear.com/7.x/bottts/png?seed=${profile.avatarSeed}`}
                    alt={`${profile.username} avatar`}
                    className="h-24 w-24 rounded-full"
                />

                <h1 className="text-center text-2xl text-white">
                    {greeting} {profile.username}
                </h1>

            </div>
        </div>
    )
} 