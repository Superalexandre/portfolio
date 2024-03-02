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