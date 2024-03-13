import { useEffect, useRef, useState } from "react"
// import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { MdCheck } from "react-icons/md"
import { Toaster, toast } from "sonner"

import { CANVAS_HEIGHT, CANVAS_WIDTH, STATIONS_NUMBER } from "./config"
import { handleCanvasClick } from "./events/handleCanvasClick"
import { handleContextMenu } from "./events/handleContextMenu"
import { handleMouseMove } from "./events/handleMouseMove"
import styles from "./style"
import { Line, checkIfLineExists, clearTempLine, drawLine } from "./utils/line"
import { Station, drawRandomStations } from "./utils/station"
import { Train, genTrain, handleTrain } from "./utils/train"
import { changeTheme, getTheme } from "./utils/utils"

export default function Index() {
    const mainLayer = useRef<HTMLCanvasElement>(null)
    const trainLayer = useRef<HTMLCanvasElement>(null)

    const stationsRef = useRef<Station[]>([])
    const linesRef = useRef<Line[]>([])
    const trainsRef = useRef<Train[]>([])

    const intervalRef = useRef<NodeJS.Timeout>()

    const [clickedStations, setClickedStations] = useState<Station[]>([])
    const [speed, setSpeed] = useState(1)

    const [color, setColor] = useState(styles.colors.purple)
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const ms = speed === 0 ? 0 : 1000 / (60 * speed)
    const realLines = linesRef.current.filter(line => line.id !== "temp")

    useEffect(() => {
        console.log("useEffect empty")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        getTheme().then(themeValue => setTheme(() => themeValue))

        if (canvas && context) {
            const stations = drawRandomStations({ context })
            stationsRef.current = stations
        }

        return () => {
            if (context) context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }, [])

    useEffect(() => {
        console.log("useEffect clickedStations")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        if (clickedStations.length >= 2) {
            // Remove the temp line
            const tempLine = linesRef.current.find(line => line.id === "temp")
            if (tempLine) linesRef.current = clearTempLine({ context, stations: stationsRef.current, lines: linesRef.current })

            // Check if the line already exists
            const alreadyExists = checkIfLineExists(linesRef.current, clickedStations)

            if (alreadyExists) {
                setClickedStations([])

                toast.error("La ligne existe déjà")

                return
            }

            const [from, to] = clickedStations
            const line = drawLine({ from, to, context, color })

            setClickedStations([])
            linesRef.current.push(line)

            toast.success("Ligne créée avec succès")
        }
    }, [clickedStations])

    useEffect(() => {
        console.log("useEffect realLines")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        const trainCanvas = trainLayer.current
        const trainContext = trainCanvas?.getContext("2d")

        if (!context || !canvas || !trainCanvas || !trainContext) return

        if (realLines.length > 0) {
            // Get the new line
            const newLine = realLines[realLines.length - 1]
            const newTrain = genTrain({
                stations: [{
                    station: newLine.from,
                    line: newLine
                }, {
                    station: newLine.to,
                    line: newLine
                }],
                lines: [newLine]
            })

            trainsRef.current.push(newTrain)
        }
    }, [realLines.length])

    useEffect(() => {
        console.log("useEffect trainsRef and ms")

        const trainCanvas = trainLayer.current
        const trainContext = trainCanvas?.getContext("2d")

        if (!trainCanvas || !trainContext) return

        if (trainsRef.current.length === 0) return
        if (intervalRef.current) clearInterval(intervalRef.current)

        if (ms === 0) return

        const { interval } = handleTrain({ trains: trainsRef, context: trainContext, ms })
        intervalRef.current = interval

        return () => {
            clearInterval(intervalRef.current)
        }

    }, [realLines.length, trainsRef.current.length, ms])

    return (
        <>
            <div className="fixed left-0 top-0 z-50 m-3">
                <LineSelector color={color} setColor={setColor} />
            </div>
            <div className="fixed right-0 top-0 z-50 m-3">
                <p className="dark:text-white">Stations : {STATIONS_NUMBER}</p>
                <p className="dark:text-white">Canvas : {CANVAS_WIDTH} x {CANVAS_HEIGHT}</p>
                <p className="dark:text-white">Nombre de lignes : {linesRef.current.length}</p>

                <ThemeSelector theme={theme} setTheme={setTheme} />

                <SpeedSelector speed={speed} setSpeed={setSpeed} />
            </div>
            <canvas
                className="bg-[#EBEBEB] dark:bg-[#070F2B]"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                ref={mainLayer}
                onClick={(event) => handleCanvasClick({ event, mainLayer, stationsRef, clickedStations, setClickedStations })}
                onContextMenu={(event) => handleContextMenu({ event, mainLayer, linesRef, stationsRef, setClickedStations })}
                onMouseMove={(event) => handleMouseMove({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations })}
            />

            <canvas
                className="absolute left-0 top-0 z-10 bg-transparent"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                ref={trainLayer}
                onClick={(event) => handleCanvasClick({ event, mainLayer, stationsRef, clickedStations, setClickedStations })}
                onContextMenu={(event) => handleContextMenu({ event, mainLayer, linesRef, stationsRef, setClickedStations })}
                onMouseMove={(event) => handleMouseMove({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations })}
            />
            <Toaster
                position="bottom-right"
                closeButton={true}
            />
        </>
    )
}

const ThemeSelector = ({ theme, setTheme }: { theme: "light" | "dark", setTheme: (theme: "light" | "dark") => void }) => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <input
                type="checkbox"
                id="theme"
                name="theme"
                defaultChecked={theme === "dark"}
                onChange={async () => {
                    const newTheme = await changeTheme()

                    setTheme(newTheme)
                }}
            />
            <label htmlFor="theme" className="dark:text-white">Thème sombre</label>
        </div>
    )
}

const SpeedSelector = ({ speed, setSpeed }: { speed: number, setSpeed: (speed: number) => void }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <p className="dark:text-white">Vitesse :</p>
            <div className="flex flex-row items-center gap-2">
                <input type="radio" id="slow" name="speed" value="slow" onChange={() => setSpeed(0)} defaultChecked={speed === 0} />
                <label htmlFor="slow" className="dark:text-white">Pause</label>
            </div>
            <div className="flex flex-row items-center gap-2">
                <input type="radio" id="slow" name="speed" value="slow" onChange={() => setSpeed(0.5)} defaultChecked={speed === 0.5} />
                <label htmlFor="slow" className="dark:text-white">Lent</label>
            </div>
            <div className="flex flex-row items-center gap-2">
                <input type="radio" id="normal" name="speed" value="normal" onChange={() => setSpeed(1)} defaultChecked={speed === 1} />
                <label htmlFor="normal" className="dark:text-white">Normal</label>
            </div>
            <div className="flex flex-row items-center gap-2">
                <input type="radio" id="fast" name="speed" value="fast" onChange={() => setSpeed(1.5)} defaultChecked={speed === 1.5} />
                <label htmlFor="fast" className="dark:text-white">Rapide</label>
            </div>
        </div>
    )

}

const LineSelector = ({ color, setColor }: { color: string, setColor: (color: string) => void }) => {
    const colorLines = Object.values(styles.colors)

    return (
        <div className="flex flex-row items-center gap-2">
            <p className="dark:text-white">Lignes :</p>
            {colorLines.map((colorLine, index) => (
                <button 
                    key={index} className={`bg-[${colorLine}] flex h-6 w-6 items-center justify-center rounded-full`}
                    onClick={() => setColor(colorLine)}
                >
                    {color === colorLine ? <MdCheck className="text-dark" /> : null}

                    <span className="sr-only">{colorLine}</span>
                </button>
            ))}
        </div>
    )


}