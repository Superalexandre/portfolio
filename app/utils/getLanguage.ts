import cookie from "cookie"
import { parseAcceptLanguage } from "intl-parse-accept-language"

import i18next from "~/i18next.server"

function getLanguage(request: Request) {
    let hasChanged = false
    let locale = i18next.options.i18next.fallbackLng
    
    // Get the language from the params
    const url = new URL(request.url)
    const params = url.searchParams
    const language = params.get("language")

    if (!hasChanged && language) {
        hasChanged = true
        locale = language
    }

    // Get the cookies from the request
    const cookies = request.headers.get("Cookie")
    const cookiesObject = cookie.parse(cookies || "")

    if (!hasChanged && cookiesObject.language) {
        hasChanged = true
        locale = cookiesObject.language
    }

    // Get the language from the headers
    const headers = request.headers.get("Accept-Language")
    const languages = parseAcceptLanguage(headers || "") || []
    const validLanguages = languages.filter((languageHeader) => i18next.options.i18next.supportedLngs.includes(languageHeader))

    if (!hasChanged && validLanguages.length > 0) {
        hasChanged = true
        locale = validLanguages[0]
    }

    return locale
}

export default getLanguage
export { getLanguage }