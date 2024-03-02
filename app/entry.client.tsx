import { RemixBrowser } from "@remix-run/react"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { I18nextProvider, initReactI18next } from "react-i18next"
import { getInitialNamespaces } from "remix-i18next/client"

import i18n from "./i18n"

async function hydrate() {
    await i18next
        .use(initReactI18next)
        .use(LanguageDetector)
        .use(Backend) 
        .init({
            ...i18n,
            ns: getInitialNamespaces(),
            backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
            detection: {
                // caches: ["localStorage"],
                caches: [],
                excludeCacheFor: ["cimode"],
                lookupLocalStorage: "language",
                lookupQuerystring: "lng",
                lookupSessionStorage: "language",
                // order: ["querystring", "localStorage", "sessionStorage", "navigator", "htmlTag"],
                order: ["htmlTag"]
            }
        })

    startTransition(() => {
        hydrateRoot(
            document,
            <I18nextProvider i18n={i18next}>
                <StrictMode>
                    <RemixBrowser />
                </StrictMode>
            </I18nextProvider>
        )
    })
}

if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate)
} else {
    window.setTimeout(hydrate, 1)
}