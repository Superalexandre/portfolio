import cookie from "cookie"

function getTheme(request: Request) {
    let hasChanged = false
    let theme = "light"
    
    // Get the language from the params
    const url = new URL(request.url)
    const params = url.searchParams
    const themeParams = params.get("theme")

    if (!hasChanged && themeParams) {
        hasChanged = true
        theme = themeParams
    }

    // Get the cookies from the request
    const cookies = request.headers.get("Cookie")
    const cookiesObject = cookie.parse(cookies || "")

    if (!hasChanged && cookiesObject.theme) {
        hasChanged = true
        theme = cookiesObject.theme
    }

    return theme
}

export default getTheme
export { getTheme }