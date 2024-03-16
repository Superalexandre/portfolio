import { changeTheme } from "../utils/utils"

interface ThemeSelectorProps {
    theme: "light" | "dark"
    setTheme: (theme: "light" | "dark") => void
}

const ThemeSelector = ({ theme, setTheme }: ThemeSelectorProps) => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <input
                type="checkbox"
                id="theme"
                name="theme"
                checked={theme === "dark"}
                onChange={async () => {
                    const newTheme = await changeTheme()

                    setTheme(newTheme)
                }}
            />
            <label htmlFor="theme" className="dark:text-white">Thème sombre</label>
        </div>
    )
}

export default ThemeSelector
export { ThemeSelector }
export type { ThemeSelectorProps }