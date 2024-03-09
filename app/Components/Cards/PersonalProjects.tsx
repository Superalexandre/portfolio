import { Link } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { MdComputer } from "react-icons/md"

import { personalProjects, type PersonalProject as PersonalProjectType } from "@/informations/personalProject"

import Card from "../Card"

export default function PersonalProjects() {
    const { t } = useTranslation("common")

    return (
        <Card>
            <h1 className="flex flex-col items-center gap-4 text-center text-3xl font-bold dark:text-white lg:flex-row">
                <MdComputer />

                {t("personalProjects.title")}
            </h1>

            <div className="flex flex-col items-center justify-center">
                {personalProjects.map((project, index) => <PersonalProject key={index} project={project }/>)}
            </div>
        </Card>
    )
}

const PersonalProject = ({ project }: { project: PersonalProjectType }) => {
    return (
        <Link to={`/project/${project.id}`} className="dark:text-white">{project.name}</Link>
    )
}