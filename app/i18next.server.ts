import { resolve } from "node:path"

import Backend from "i18next-fs-backend"
import { RemixI18Next } from "remix-i18next/server"

import i18n from "./i18n"

/*
interface I18NextConfig {
    detection: {
        supportedLanguages: string[]
        fallbackLanguage: string
    }
    i18next: {
        defaultNS: string
        ns: string[]
        supportedLngs: string[]
        fallbackLng: string
        backend: {
            loadPath: string
        }
    }
    plugins: []
}
*/

const i18next = new RemixI18Next({
    detection: {
        supportedLanguages: i18n.supportedLngs,
        fallbackLanguage: i18n.fallbackLng,
    },
    i18next: {
        ...i18n,
        backend: {
            loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
        },
    },
    plugins: [Backend],
})

export default i18next