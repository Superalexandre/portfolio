import { Links, Meta, Scripts, isRouteErrorResponse, useRouteError } from "@remix-run/react"

import NotFound from "./not-found"

export default function ErrorBoundary() {
    
    const error = useRouteError()

    const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : "Unknown Error"

    if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />

    return (
        <html>
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <p>Une erreur est survenue :</p>
                <code>
                    {message}
                </code>
                <Scripts />
            </body>
        </html>
    )

}