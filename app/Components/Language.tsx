import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdLanguage } from "react-icons/md"
import Cookies from "universal-cookie"

export default function Language() {
    const [isOpen, setIsOpen] = useState(false)
    const { i18n } = useTranslation()

    const setLanguage = (locale: string) => {
        const cookies = new Cookies(null, { path: "/" })

        i18n.changeLanguage(locale)
        cookies.set("language", locale)
    }

    return (
        <div className="group">
            <button 
                className="hover:cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}    
                aria-label="Change language"
            >
                <MdLanguage 
                    className="dark:text-white" 
                    size={30}
                />
            </button>

            <div 
                className={`${isOpen ? "block" : "hidden"} absolute -top-1/2 right-full rounded-lg border border-slate-900 bg-slate-300 p-3 group-hover:block dark:border-slate-500 dark:bg-slate-900`}
            >
                <button
                    className="hover:text-main-color dark:text-white dark:hover:text-main-color"
                    onClick={() => setLanguage("fr-FR")}
                    aria-label="Français"
                >
                    Français
                </button>
                <button
                    className="hover:text-main-color dark:text-white dark:hover:text-main-color"
                    onClick={() => setLanguage("en-GB")}
                    aria-label="English"
                >
                    English
                </button>
            </div>
        </div>
    )
}