import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { MdLanguage } from "react-icons/md"


import type { Language as LanguageType } from "@/informations/languages"
import languages from "@/informations/languages"

import Card from "../Card"

export default function Languages() {
    const { t } = useTranslation("common")

    return (
        <Card>
            <h1 className="flex flex-col items-center gap-4 text-center text-3xl font-bold dark:text-white lg:flex-row">
                <MdLanguage />

                {t("languages.title")}
            </h1>

            <div className="flex flex-col items-center justify-center">
                {languages.map((language, index) => <Language key={index} language={language} t={t} />)}
            </div>
        </Card>
    )
}

const Language = ({ language, t }: { language: LanguageType, t: TFunction<"common", undefined> }) => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <img src={language.image} alt={language.name} className="h-8 w-8" />

            <p className="dark:text-white">{t(`languages.${language.code}`)}</p>
        </div>
    )
}