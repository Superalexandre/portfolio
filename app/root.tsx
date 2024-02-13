import { useLocalStorageValue } from "@react-hookz/web"
import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction } from "@remix-run/node"
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { useChangeLanguage } from "~/Components/utils/useChangeLanguage"
import stylesheet from "~/tailwind.css"

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export default function App() {
    const language = useLocalStorageValue("language")
    const { i18n } = useTranslation()

    const locale = language.value as string || i18n.languages[0]
  
    useChangeLanguage(locale)
  
    return (
        <html lang={locale} dir={i18n.dir()} className="min-w-full h-full min-h-full">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="min-w-full min-h-full">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
