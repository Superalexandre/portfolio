import { TFunction } from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdSchool } from "react-icons/md"

import { schools as schoolsData } from "@/informations/schools"
import { School as SchoolType } from "@/informations/schools"

import { DateOptions, formatDate } from "../../utils/date"
import Card from "../Card"


export default function Schools() {
    const { t, i18n } = useTranslation("common")
    const [sorted/*, setSorted*/] = useState<"asc" | "desc">("desc")

    const sortFunction = (a: SchoolType, b: SchoolType) => {
        if (sorted === "asc") {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        } else {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        }
    }

    const [schools/*, setSchools*/] = useState<SchoolType[]>(schoolsData.sort(sortFunction))

    return (
        <Card className="relative">
            {/* <button
                className="absolute top-0 right-0 m-5 mt-10 dark:text-white text-lg hover:text-main-color dark:hover:text-main-color"
                onClick={() => {
                    setSorted(sorted === "asc" ? "desc" : "asc")
                    setSchools(schools.sort(sortFunction))
                }}
            >
                {sorted === "asc" ? "Trier par date de fin" : "Trier par date de début"}
            </button> */}


            <h1 className="flex items-center justify-center gap-4 text-3xl font-bold dark:text-white">
                <MdSchool className="inline-block" />

                {t("schools.title")}
            </h1>


            <div className="relative min-h-96">
                <div className="absolute flex h-full w-full items-center justify-center">
                    <div className="h-full w-1 bg-main-color"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                    {schools.map((school, index) => <School key={index} school={school} lang={i18n.language} t={t} />)}
                </div>

            </div>
        </Card>
    )
}

const School = ({ school, lang, t }: { school: SchoolType, lang: string, t: TFunction<"common", undefined> }) => {
    const { name, code, startDate, endDate } = school

    const today = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    const happeningNow = start <= today && today <= end

    const options: DateOptions = { year: "numeric", month: "long", lang: lang }

    const formattedStartDate = formatDate(start, options)
    const formattedEndDate = formatDate(end, options)

    return (
        <div className="flex w-5/6 flex-col items-center justify-center gap-4 rounded-lg bg-slate-300 p-4 transition-all duration-300 hover:scale-110 dark:bg-slate-900 lg:w-3/6">
            <h2 className="text-center text-2xl font-bold dark:text-white">{name} {happeningNow ? t("happeningNow") : ""}</h2>
            <p className="text-center dark:text-white">{formattedStartDate} -{">"} {formattedEndDate}</p>
            <Description code={code} t={t} />
        </div>
    )
}

const Description = ({ code, t }: { code: string, t: TFunction<"common", undefined> }) => {
    const description = t(`schools.${code}.description`)

    // Match if there is a link balise
    const linkMatches = description.matchAll(/<link href='(.*?)'>(.*?)<\/link>/g)

    let updatedDescription = description

    // Loop through all matches and replace them
    for (const linkMatch of linkMatches) {
        const linkHref = linkMatch[1]
        const linkText = linkMatch[2]

        updatedDescription = updatedDescription.replace(linkMatch[0], link({ href: linkHref, text: linkText }))
    }

    return <p className="text-center dark:text-white" dangerouslySetInnerHTML={{ __html: updatedDescription }} />
}

const link = ({ href, text }: { href: string, text: string }) => {
    const className = "dark:text-white hover:text-main-color dark:hover:text-main-color underline decoration-main-color"
    const linkTag = `<a href=${href} rel="noreferrer" class="${className}">${text}</a>`
    
    return linkTag
}