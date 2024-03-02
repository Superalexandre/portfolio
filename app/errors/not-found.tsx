import { Links, Meta, Scripts } from "@remix-run/react"

export default function NotFound() {
    return (
        <html lang="fr-FR" className="h-full min-h-full min-w-full">
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
                    {"La page que vous cherchez n'existe pas"}
                </h1>

                <a href="/" className="text-white underline hover:text-main-color">
                    {"Retour à l'accueil"}
                </a>

                <Scripts />
            </body>
        </html>
    )

}