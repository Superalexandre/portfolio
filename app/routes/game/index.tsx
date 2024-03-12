import { useEffect, useRef, useState } from "react"
// import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { Toaster, toast } from "sonner"

import { CANVAS_HEIGHT, CANVAS_WIDTH, STATIONS_NUMBER } from "./config"
import { handleCanvasClick } from "./events/handleCanvasClick"
import { handleContextMenu } from "./events/handleContextMenu"
import { handleMouseMove } from "./events/handleMouseMove"
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
    const [speed,] = useState(1)
    
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const realLines = linesRef.current.filter(line => line.id !== "temp")

    useEffect(() => {
        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        getTheme().then(themeValue => setTheme(themeValue))

        if (canvas && context) {
            const stations = drawRandomStations({ context })
            stationsRef.current = stations
        }

        return () => {
            if (context) context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }, [])

    useEffect(() => {
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
            const line = drawLine({ from, to, context })

            setClickedStations([])
            linesRef.current.push(line)

            toast.success("Ligne créée avec succès")
        }
    }, [clickedStations])

    useEffect(() => {
        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        const trainCanvas = trainLayer.current
        const trainContext = trainCanvas?.getContext("2d")

        if (!context || !canvas || !trainCanvas || !trainContext) return

        if (realLines.length > 0) {
            // Get the new line
            const newLine = realLines[realLines.length - 1]
            const newTrain = genTrain({ fromTo: [newLine] })

            trainsRef.current.push(newTrain)
        }

        if (trainsRef.current.length === 0) return
        if (intervalRef.current) clearInterval(intervalRef.current)
        
        const { interval } = handleTrain({ trains: trainsRef, context: trainContext, speed })
        intervalRef.current = interval

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [realLines.length])

    return (
        <>
            <div className="fixed right-0 top-0 m-3">
                <p className="dark:text-white">Stations : {STATIONS_NUMBER}</p>
                <p className="dark:text-white">Canvas : {CANVAS_WIDTH} x {CANVAS_HEIGHT}</p>
                <p className="dark:text-white">Nombre de lignes : {linesRef.current.length}</p>
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