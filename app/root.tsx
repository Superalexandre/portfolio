import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction } from "@remix-run/node"
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from "@remix-run/react"
import { useTranslation } from "react-i18next"

// import optimizedStyles from "~/tailwind-minify.css"
import stylesheet from "~/tailwind.css"

import Birthday from "./Components/Birthday"
import ErrorBoundary from "./errors/error"

export const links: LinksFunction = () => [
    // ...(process.env.NODE_ENV === "development" ? [{ rel: "stylesheet", href: stylesheet }] : []),
    // ...(process.env.NODE_ENV === "production" && optimizedStyles ? [{ rel: "stylesheet", href: optimizedStyles }] : []),
    { rel: "stylesheet", href: stylesheet },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export default function App() {
    const { i18n } = useTranslation()

    return (
        <html lang={i18n.language} dir={i18n.dir()} className="h-full min-h-full min-w-full">
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