import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { useTranslation } from "react-i18next"

import i18next from "~/i18next.server"
import getLanguage from "~/utils/getLanguage"

export const handle = { i18n: "common" }
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title },
        { name: "description", content: data?.description },
    ]
}

export async function loader({ request }: ActionFunctionArgs) {
    const language = getLanguage(request)
    const t = await i18next.getFixedT(language, null, "common")
    
    const title = t("profile.settings.meta.title")
    const description = t("profile.settings.meta.description")

    return json({
        title,
        description
    })
}

export default function Index() {
    const { t } = useTranslation("common")

    return (
        <div className="flex w-full flex-col items-center justify-center" >
            <div className="m-4 flex flex-col items-center gap-4">
                <h1 className="text-center text-2xl text-white">
                    {t("profile.settings.profileSettings")}
                </h1>
            </div>
        </div>
    )
}