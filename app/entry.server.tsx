import { resolve as resolvePath } from "node:path"
import { PassThrough } from "node:stream"

import type { EntryContext } from "@remix-run/node"
import { createReadableStreamFromReadable } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { createInstance } from "i18next"
import Backend from "i18next-fs-backend"
import { isbot } from "isbot"
import { renderToPipeableStream } from "react-dom/server"
import { I18nextProvider, initReactI18next } from "react-i18next"


import i18n from "./i18n"
import i18next from "./i18next.server"
import Logger from "../logger/logger.js"

const ABORT_DELAY = 5_000

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    // loadContext: AppLoadContext,
) {
    const instance = createInstance()
    // const lng = await i18next.getLocale(request)
    const ns = i18next.getRouteNamespaces(remixContext)

    await instance
        .use(initReactI18next) // Tell our instance to use react-i18next
        .use(Backend) // Setup our backend
        .init({
            ...i18n, // spread the configuration
            ns, // The namespaces the routes about to render wants to use
            backend: { loadPath: resolvePath("./public/locales/{{lng}}/{{ns}}.json") },
        })

    const callbackName = isbot(request.headers.get("user-agent"))
        ? "onAllReady"
        : "onShellReady"

    return new Promise((resolve, reject) => {
        let didError = false

        const { pipe, abort } = renderToPipeableStream(
            <I18nextProvider i18n={instance}>
                <RemixServer
                    context={remixContext}
                    url={request.url}
                    abortDelay={ABORT_DELAY}
                />
            </I18nextProvider>,
            {
                [callbackName]: () => {
                    const body = new PassThrough()
                    const stream = createReadableStreamFromReadable(body)

                    responseHeaders.set("Content-Type", "text/html")

                    const response = new Response(stream, {
                        headers: responseHeaders,
                        status: didError ? 500 : responseStatusCode,
                    })

                    resolve(response)

                    pipe(body)
                    resolve(response)
                },
                onShellError(error: unknown) {
                    reject(error)
                },
                onError(error: unknown) {
                    didError = true

                    Logger.error("handleRequest", error)
                }
            },
        )

        setTimeout(abort, ABORT_DELAY)
    })
}