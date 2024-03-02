import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    json,
    useLoaderData
} from "@remix-run/react"
import { useTranslation } from "react-i18next"

import stylesheet from "~/tailwind.css"

import Birthday from "./Components/Birthday"
import ErrorBoundary from "./errors/error"
import useChangeLanguage from "./hooks/useChangeLanguage"
import getLanguage from "./utils/getLanguage"
import getTheme from "./utils/getTheme"

export const handle = { i18n: "common" }
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export function loader({ request }: LoaderFunctionArgs) {
    const locale = getLanguage(request)
    const theme = getTheme(request)

    return json({ locale, theme })
}

export default function App() {
    const { locale, theme } = useLoaderData<typeof loader>()
    const { i18n } = useTranslation()

    useChangeLanguage(locale)

    return (
        <html lang={i18n.language} dir={i18n.dir()} className={`h-full min-h-full min-w-full ${theme}`}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="min-h-full min-w-full">
                <Birthday>
                    <Outlet />
                </Birthday>

                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}

export {
    ErrorBoundary
}