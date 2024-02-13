import { MdDarkMode, MdLightMode } from "react-icons/md"

export default function Theme({ theme, setTheme }: { theme: "light" | "dark", setTheme: (theme: React.SetStateAction<"light" | "dark">) => void }) {
    return (

        <button
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        >
            {theme === "dark" ?
                <MdLightMode size={30} className="dark:text-white" />
                :
                <MdDarkMode size={30} />
            }
        </button>
    )
}