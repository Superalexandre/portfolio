import { useLocalStorageValue } from "@react-hookz/web"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdLanguage } from "react-icons/md"

import useChangeLanguage from "../hooks/useChangeLanguage"

export default function Language() {
    const { i18n } = useTranslation()

    const cachedLanguage = useLocalStorageValue("language")

    const [language, setLanguage] = useState(cachedLanguage.value as string || i18n.language)
    const [isOpen, setIsOpen] = useState(false)

    useChangeLanguage(language)

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
                className={`${isOpen ? "block" : "hidden"} group-hover:block absolute -top-1/2 right-full p-3 dark:bg-slate-900 bg-slate-300 rounded-lg border border-slate-900 dark:border-slate-500`}
            >
                <button
                    className="dark:text-white dark:hover:text-main-color hover:text-main-color"
                    onClick={() => setLanguage("fr-FR")}
                    aria-label="Français"
                >
                    Français
                </button>
                <button
                    className="dark:text-white dark:hover:text-main-color hover:text-main-color"
                    onClick={() => setLanguage("en-GB")}
                    aria-label="English"
                >
                    English
                </button>
            </div>
        </div>
    )
}