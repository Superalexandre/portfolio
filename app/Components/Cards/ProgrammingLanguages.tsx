import { useTranslation } from "react-i18next"
import { MdComputer } from "react-icons/md"


import type { ProgrammingLanguage as ProgrammingLanguageType } from "@/informations/programmingLanguages"
import programmingLanguages from "@/informations/programmingLanguages"

import Card from "../Card"

export default function ProgrammingLanguages() {
    const { t } = useTranslation("common")

    return (
        <Card>
            <h1 className="flex flex-col items-center gap-4 text-center text-3xl font-bold dark:text-white lg:flex-row">
                <MdComputer />

                {t("programmingLanguages.title")}
            </h1>

            <div className="flex flex-col items-center justify-center">
                {programmingLanguages.map((language, index) => <ProgrammingLanguage key={index} language={language} />)}
            </div>
        </Card>
    )
}

const ProgrammingLanguage = ({ language }: { language: ProgrammingLanguageType }) => {
    return (
        <p className="dark:text-white">{language.name}</p>
    )
}