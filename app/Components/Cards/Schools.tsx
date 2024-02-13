import { TFunction } from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdSchool } from "react-icons/md"

import { schools as schoolsData } from "~/Data/schools"
import { School as SchoolType } from "~/Data/schools"

import Card from "../Card"
import { DateOptions, formatDate } from "../utils/date"

export default function Schools() {
    const { t, i18n } = useTranslation("common")
    const [sorted, setSorted] = useState<"asc" | "desc">("desc")

    const sortFunction = (a: SchoolType, b: SchoolType) => {
        if (sorted === "asc") {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        } else {
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        }
    }

    const [schools, setSchools] = useState<SchoolType[]>(schoolsData.sort(sortFunction))

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


            <h1 className="dark:text-white font-bold text-3xl flex items-center justify-center gap-4">
                <MdSchool className="inline-block" />

                {t("schools.title")}
            </h1>


            <div className="min-h-96 relative">
                <div className="w-full h-full flex justify-center items-center absolute">
                    <div className="bg-main-color w-1 h-full"></div>
                </div>

                <div className="flex flex-col gap-6 relative z-10 justify-center items-center">
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
        <div className="flex flex-col items-center justify-center dark:bg-slate-900 bg-slate-300 rounded-lg gap-4 p-4 lg:w-3/6 w-5/6 hover:scale-110 transition-all duration-300">
            <h2 className="dark:text-white font-bold text-2xl text-center">{name} {happeningNow ? t("happeningNow") : ""}</h2>
            <p className="dark:text-white text-center">{formattedStartDate} -{">"} {formattedEndDate}</p>
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

    return <p className="dark:text-white text-center" dangerouslySetInnerHTML={{ __html: updatedDescription }} />
}

const link = ({ href, text }: { href: string, text: string }) => {
    const linkTag = `
        <a 
            href=${href} 
            rel="noreferrer" 
            class="dark:text-white hover:text-main-color dark:hover:text-main-color underline decoration-main-color"
        >
            ${text}
        </a>
    `
    
    return linkTag
}