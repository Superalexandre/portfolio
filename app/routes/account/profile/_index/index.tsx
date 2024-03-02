import { ActionFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import i18next from "~/i18next.server"
import { getUser } from "~/session.server"
import getLanguage from "~/utils/getLanguage"

export const handle = { i18n: "common" }
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title + " - " + data?.profile.username },
        { name: "description", content: data?.description },
    ]
}

export async function loader({ request }: ActionFunctionArgs) {
    const language = getLanguage(request)
    const t = await i18next.getFixedT(language, null, "common")

    const profile = await getUser(request)
    if (!profile) return redirect("/account/login")
    
    const title = t("profile.meta.title")
    const description = t("profile.meta.description")

    return json({
        profile,
        title,
        description
    })
}

export default function Index() {
    const { profile } = useLoaderData<typeof loader>()
    const { t } = useTranslation("common")

    const date = new Date()
    const greeting = date.getHours() < 12 ? t("profile.greetings.day") : t("profile.greetings.night")

    return (
        <div className="flex w-full flex-row justify-center" >
            <div className="m-4 flex flex-col items-center gap-4">
                <img
                    src={`https://api.dicebear.com/7.x/bottts/png?seed=${profile.avatarSeed}`}
                    alt={`${profile.username} avatar`}
                    className="h-24 w-24 rounded-full"
                />

                <h1 className="text-center text-2xl text-white">
                    {greeting}, {profile.username}
                </h1>

            </div>
        </div>
    )
} 