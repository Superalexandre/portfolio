import { ActionFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
// import { useTranslation } from "react-i18next"

import User from "@/types/User"
// import i18next from "~/i18next.server"
import { getUser } from "~/session.server"
// import getLanguage from "~/utils/getLanguage"

import getPersonalities from "./getPersonalities"

export const handle = { i18n: "common" }
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title + " - " + data?.username },
        { name: "description", content: data?.description },
    ]
}

export async function loader({ request }: ActionFunctionArgs) {
    const profile = await getUser(request)
    if (!profile) return redirect("/account/login")

    const personalities = await getPersonalities(profile as User)

    // const language = getLanguage(request)
    // const t = await i18next.getFixedT(language, null, "common")
    
    // const title = t("profile.myMessages.meta.title")
    // const description = t("profile.myMessages.meta.description")

    return json({
        ...profile,
        ...personalities,
        title: "Liste des personnalités",
        description: "Liste des personnalités"
    })
}

export default function Index() {
    const { personalities } = useLoaderData<typeof loader>()
    // const { t } = useTranslation("common")

    return (
        <div className="flex w-full flex-col items-center justify-center" >
            <div className="m-4 flex flex-col items-center gap-4">
                <h1 className="text-center text-2xl text-white">
                    {/* {t("profile.myMessages.messageList")} */}

                    Liste des personnalités
                </h1>
            </div>

            <div className="flex flex-col items-center justify-center">
                {personalities.map((personality) => (
                    <div
                        key={personality.id}
                        className="flex flex-row items-center justify-center gap-4 text-center text-white"
                    >
                        <p>Vous avez eu {personality.personage} sur le test {personality.testName}</p>
                        <p>Date : {personality.createdAt}</p>
                    </div>
                ))}
            </div>

            
            <Link
                to="/personality" 
                className="z-10 my-4 rounded-lg bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-700 lg:absolute lg:bottom-0 lg:right-0 lg:m-4"
            >
                {/* {t("profile.myMessages.createMessage")} */}

                Faire un test de personnalité
            </Link>
        </div>
    )
}