import { useTranslation } from "react-i18next"

import information from "@/informations/informations"

import { DateOptions, formatDate } from "../../utils/date"
import Card from "../Card"
import YearsOld from "../YearsOld"

export default function NameCard() {
    const { t, i18n } = useTranslation()

    const options: DateOptions = {
        lang: i18n.language,
        year: "numeric",
        month: "long",
        day: "numeric"
    }

    return (
        <Card>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-center text-3xl font-bold dark:text-white">Alexandre RENARD</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
                <p className="text-center dark:text-white">{t("description")}</p>

                <YearsOld
                    className="hover:text-main-color dark:text-white dark:hover:text-main-color"
                    startDate={information.birthDate}
                />

                <p className="text-center dark:text-white">{t("born")} {formatDate(information.birthDate, options)}</p>
            </div>
        </Card>
    )
}