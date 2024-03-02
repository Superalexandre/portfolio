import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Cookies from "universal-cookie"

function useChangeLanguage(locale: string) {
    const { i18n } = useTranslation()
    const cookies = new Cookies(null, { path: "/" })

    useEffect(() => {
        i18n.changeLanguage(locale)
        
        cookies.set("language", locale)
    }, [locale, i18n])
}

export { useChangeLanguage }
export default useChangeLanguage