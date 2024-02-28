import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface YearsOldProps {
    display: string;
    formattedTotal: string;
    formattedYears: string;
    formattedMonths: string;
    formattedDays: string;
    formattedMinutes: string;
    formattedSeconds: string;
    formattedMilliseconds: string;
    [key: string]: string;
}

export const handle = { i18n: "times" }
export default function YearsOld({ className, startDate, endDate }: { className?: string, startDate: Date | string | number, endDate?: Date | string | number }) {
    const { t } = useTranslation("times")

    const [data, setData] = useState({
        display: "formattedTotal",
        formattedTotal: `${t("year", { count: 0 })}, ${t("month", { count: 0 })}, ${t("day", { count: 0 })}, ${t("hour", { count: 0 })}, ${t("minute", { count: 0 })} ${t("and")} ${t("second", { count: 0 })}`,
        formattedYears: t("year", { count: 0 }),
        formattedMonths: t("month", { count: 0 }),
        formattedDays: t("day", { count: 0 }),
        formattedHours: t("hour", { count: 0 }),
        formattedMinutes: t("minute", { count: 0 }),
        formattedSeconds: t("second", { count: 0 }),
        formattedMilliseconds: t("millisecond", { count: 0 })
    })

    useEffect(() => {
        const calculateAge = () => {
            const age = new Date(endDate || Date.now()).getTime() - new Date(startDate).getTime()

            const years = Math.floor(age / (1000 * 60 * 60 * 24 * 365))

            const totalMonths = Math.floor(age / (1000 * 60 * 60 * 24 * 30))
            const months = Math.floor((age % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))

            const totalDays = Math.floor(age / (1000 * 60 * 60 * 24))
            const days = Math.floor((age % (1000 * 60 * 60 * 24 * 365)) % (1000 * 60 * 60 * 24 * 30) / (1000 * 60 * 60 * 24))

            const totalHours = Math.floor(age / (1000 * 60 * 60))
            const hours = Math.floor((age % (1000 * 60 * 60 * 24 * 365)) % (1000 * 60 * 60 * 24 * 30) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))

            const totalMinutes = Math.floor(age / (1000 * 60))
            const minutes = Math.floor((age % (1000 * 60 * 60 * 24 * 365)) % (1000 * 60 * 60 * 24 * 30) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) / (1000 * 60))

            const totalSeconds = Math.floor(age / 1000)
            const seconds = Math.floor((age % (1000 * 60 * 60 * 24 * 365)) % (1000 * 60 * 60 * 24 * 30) % (1000 * 60 * 60 * 24) % (1000 * 60 * 60) % (1000 * 60) / 1000)

            const totalMilliseconds = Math.floor(age)

            setData((prev) => {
                return {
                    display: prev.display,
                    formattedTotal: `${t("year", { count: years })}, ${t("month", { count: months })}, ${t("day", { count: days })}, ${t("hour", { count: hours })}, ${t("minute", { count: minutes })} ${t("and")} ${t("second", { count: seconds })}`,
                    formattedYears: t("year", { count: years }),
                    formattedMonths: t("month", { count: totalMonths }),
                    formattedDays: t("day", { count: totalDays }),
                    formattedHours: t("hour", { count: totalHours }),
                    formattedMinutes: t("minute", { count: totalMinutes }),
                    formattedSeconds: t("second", { count: totalSeconds }),
                    formattedMilliseconds: t("millisecond", { count: totalMilliseconds })
                }
            })
        }

        calculateAge()

        setInterval(() => {
            calculateAge()
        }, 1000)
    }, [startDate, endDate, t])

    return (
        <button
            onClick={(e) => {
                e.preventDefault()

                const options = ["formattedTotal", "formattedYears", "formattedMonths", "formattedDays", "formattedHours", "formattedMinutes", "formattedSeconds", "formattedMilliseconds"]

                setData((prev) => {
                    return {
                        ...prev,
                        display: options[options.indexOf(prev.display) + 1] || options[0]
                    }
                })
            }}

            className={className}
        >
            {(data as YearsOldProps)[data.display]}
        </button>
    )
} 