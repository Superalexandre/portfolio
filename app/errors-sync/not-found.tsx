import { Links, Meta, Scripts } from "@remix-run/react"

export default function NotFound() {
    return (
        <html className="min-w-full h-full min-h-full">
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body className="min-w-full min-h-full flex flex-col justify-center items-center bg-slate-700 gap-4">
                <img 
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Loudly%20Crying%20Face.png" 
                    alt="Loudly Crying Face" 
                    width="150" 
                    height="150"
                />

                <h1 className="text-white font-bold text-2xl">
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