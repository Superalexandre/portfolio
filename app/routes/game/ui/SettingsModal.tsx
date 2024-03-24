import { Link } from "@remix-run/react"
import { MdClose } from "react-icons/md"

import ThemeSelector from "./ThemeSelector"
import { STATIONS_NUMBER } from "../config"
import { Line } from "../utils/line"
import { Station } from "../utils/station"
import { Train } from "../utils/train"

interface SettingsModalProps {
    hidden: boolean
    setHidden: () => void

    theme: "light" | "dark"
    setTheme: (theme: "light" | "dark") => void

    handleDownload: () => void

    data: {
        smallScreen: boolean
        stations: Station[]
        lines: Line[]
        trains: Train[]
    }

    canvas: {
        width: number
        height: number
    }
}

const SettingsModal = ({ hidden, setHidden, theme, setTheme, handleDownload, data, canvas }: SettingsModalProps) => {
    return (
        <div className={`${hidden ? "hidden" : "block"} fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80`}>
            <div className="relative z-50 m-8 flex flex-col items-center justify-center gap-8 rounded-md bg-slate-400 p-8 dark:bg-slate-700 lg:m-0">
                <button
                    onClick={setHidden}
                    className="absolute right-0 top-0 m-4 hover:text-white dark:text-white dark:hover:text-black"
                >
                    <MdClose size={16} />
                </button>

                <ThemeSelector
                    theme={theme}
                    setTheme={setTheme}
                />

                <div className="flex flex-col items-center justify-center">
                    <p className="text-center dark:text-white">Data :</p>
                    <p className="text-center dark:text-white">Stations : {STATIONS_NUMBER}</p>
                    <p className="text-center dark:text-white">Canvas : {canvas.width} x {canvas.height}</p>
                    <p className="text-center dark:text-white">Petit écran : {data.smallScreen ? "oui" : "non"}</p>
                    <p className="text-center dark:text-white">Nombre de lignes : {data.lines.length}</p>
                    <p className="text-center dark:text-white">Nombre de trains : {data.trains.length}</p>
                </div>

                <button
                    onClick={handleDownload}
                    className="text-center hover:underline dark:text-white"
                >
                    Télécharger les données
                </button>

                <Link
                    to="/game"
                    className="text-center hover:underline dark:text-white"
                >
                    {"Retour à l'accueil"}
                </Link>
            </div>
        </div>
    )
}

export default SettingsModal
export { SettingsModal }
export type { SettingsModalProps }