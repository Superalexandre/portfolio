import type { MetaFunction } from "@remix-run/node"

import Background from "~/Components/Background"
import Languages from "~/Components/Cards/Languages"
import NameCard from "~/Components/Cards/Name"
import PersonalProjects from "~/Components/Cards/PersonalProjects"
import ProgrammingLanguages from "~/Components/Cards/ProgrammingLanguages"
import Schools from "~/Components/Cards/Schools"

export const meta: MetaFunction = () => {
    return [
        { title: "Portfolio - Alexandre Renard" },
        { name: "description", content: "Portfolio d'Alexandre Renard" },
    ]
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
