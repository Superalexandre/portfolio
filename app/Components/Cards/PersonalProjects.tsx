// import { useTranslation } from "react-i18next"
import { MdComputer } from "react-icons/md"

import { personalProjects, type PersonalProject as PersonalProjectType } from "~/Data/personalProject"

import Card from "../Card"

export default function PersonalProjects() {
    // const { t } = useTranslation("common")

    return (
        <Card>
            <h1 className="dark:text-white font-bold text-3xl flex items-center justify-center gap-4 text-center">
                <MdComputer className="inline-block" />

                Projet personnels
            </h1>

            <div className="flex flex-col items-center justify-center">
                {personalProjects.map((project, index) => <PersonalProject key={index} project={project }/>)}
            </div>
        </Card>
    )
}

const PersonalProject = ({ project }: { project: PersonalProjectType }) => {
    return (
        <a href={`/project/${project.id}`} className="dark:text-white">{project.name}</a>
    )
}