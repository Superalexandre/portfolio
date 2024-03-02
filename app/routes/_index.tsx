import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"

import Background from "~/Components/Background"
import Languages from "~/Components/Cards/Languages"
import NameCard from "~/Components/Cards/Name"
import PersonalProjects from "~/Components/Cards/PersonalProjects"
import ProgrammingLanguages from "~/Components/Cards/ProgrammingLanguages"
import Schools from "~/Components/Cards/Schools"
import i18next from "~/i18next.server"
import getLanguage from "~/utils/getLanguage"

export const handle = { i18n: "common" }
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title },
        { name: "description", content: data?.description },
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const language = getLanguage(request)
    const t = await i18next.getFixedT(language, null, "common")

    const title = t("meta.title")
    const description = t("meta.description")

    return { title, description }
}

export default function Index() {
    return (
        <Background className="h-full min-h-screen min-w-full p-5">
            <div className="flex flex-col gap-5">
                <NameCard />
            
                <Schools />
            
                <Languages />
            
                <ProgrammingLanguages />

                <PersonalProjects />
            </div>
        </Background>
    )
}
