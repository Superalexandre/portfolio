import { useTranslation } from "react-i18next"

import information from "~/Data/informations"

import Card from "../Card"
import { DateOptions, formatDate } from "../utils/date"
import YearsOld from "../utils/YearsOld"

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
                <h1 className="dark:text-white font-bold text-3xl text-center">Alexandre RENARD</h1>
            </div>
            <div className="flex flex-col items-center justify-center">
                <p className="dark:text-white text-center">{t("description")}</p>

                <YearsOld
                    className="dark:text-white dark:hover:text-main-color hover:text-main-color"
                    startDate={information.birthDate}
                />

                <p className="dark:text-white text-center">{t("born")} {formatDate(information.birthDate, options)}</p>
            </div>
        </Card>
    )
}