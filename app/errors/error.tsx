import { Links, Meta, Scripts, isRouteErrorResponse, useRouteError } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import NotFound from "./not-found"

export default function ErrorBoundary() {
    const { i18n, t } = useTranslation("common")

    const error = useRouteError()

    const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : t("error.unknownError")

    if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />

    return (
        <html lang={i18n.language} dir={i18n.dir()}>
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <p>{t("error.errorOccurred")}</p>
                <code>
                    {message}
                </code>
                <Scripts />
            </body>
        </html>
    )

}