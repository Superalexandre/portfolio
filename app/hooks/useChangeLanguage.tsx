import { useLocalStorageValue } from "@react-hookz/web"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

function useChangeLanguage(locale: string) {
    const { i18n } = useTranslation()
    const language = useLocalStorageValue("language")
    
    useEffect(() => {
        i18n.changeLanguage(locale)

        language.set(locale)
    }, [locale, i18n])
} 

export { useChangeLanguage }
export default useChangeLanguage