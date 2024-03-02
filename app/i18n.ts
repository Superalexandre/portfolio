import { InitOptions } from "i18next"

const i18n = {
    supportedLngs: ["en-GB", "fr-FR"],
    fallbackLng: "fr-FR",
    defaultNS: "common",
    interpolation: {
        escapeValue: false,
    },
    react: { useSuspense: false },
} satisfies InitOptions


export default i18n