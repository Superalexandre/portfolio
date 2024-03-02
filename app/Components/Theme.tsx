import { useEffect, useState } from "react"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import Cookies from "universal-cookie"

export default function Theme() {
    const cookies = new Cookies(null, { path: "/" })
    const [theme, setTheme] = useState<null | "light" | "dark">()

    useEffect(() => {
        const syncCookie = async () => {
            const cookieTheme = await cookies.get("theme")

            if (cookieTheme === "dark") {
                setTheme("dark")
            } else {
                setTheme("light")
            }
        }

        syncCookie()
    }, [])

    const changeTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.add("light")
            document.documentElement.classList.remove("dark")

            cookies.set("theme", "light")
            setTheme("light")
        } else {
            document.documentElement.classList.remove("light")
            document.documentElement.classList.add("dark")

            cookies.set("theme", "dark")
            setTheme("dark")
        }
    }

    return (
        <button
            onClick={changeTheme}
            aria-label="Change theme"
        >
            {theme === "dark" ?
                <MdLightMode size={30} className="text-black dark:text-white" />
                :
                <MdDarkMode size={30} className="text-black dark:text-white" />
            }
        </button>
    )
}