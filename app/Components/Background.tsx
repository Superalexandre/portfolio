import { useEffect, useRef, useState } from "react"

import Language from "./Language"
import Theme from "./Theme"

export default function Background({ className, children }: { className?: string, children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    
    const backgroundContainer = useRef<HTMLDivElement>(null)

    // When theme changes, change the html body class
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [theme])

    return (
        <div className={"dark:bg-slate-700 min-w-full min-h-full " + className}>
            <div className="fixed top-0 left-0 -z-10 h-full w-full" ref={backgroundContainer}>
                {/* <div className="bg-red-500 h-10 w-10"></div> */}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 fixed bottom-7 right-7 z-50">
                <Language />
                <Theme theme={theme} setTheme={setTheme} />
            </div>

            {children}
        </div>
    )
}