import { Links, Meta, Scripts } from "@remix-run/react"
import { t } from "i18next"
import { useTranslation } from "react-i18next"

export const handle = { i18n: "common" }
export default function NotFound() {
    const { i18n } = useTranslation("common")

    return (
        <html lang={i18n.language} dir={i18n.dir()} className="h-full min-h-full min-w-full">
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body className="flex min-h-full min-w-full flex-col items-center justify-center gap-4 bg-slate-700">
                <img 
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Loudly%20Crying%20Face.png" 
                    alt="Loudly Crying Face" 
                    width="150" 
                    height="150"
                />

                <h1 className="text-2xl font-bold text-white">
                    {t("error.notFound")}
                </h1>

                <a href="/" className="text-white underline hover:text-main-color">
                    {t("error.backHome")}
                </a>

                <Scripts />
            </body>
        </html>
    )

}