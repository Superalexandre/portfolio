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
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const stationsRef = useRef<Station[]>([])
    const linesRef = useRef<Line[]>([])
    const trainsRef = useRef<Train[]>([])

    const [clickedStations, setClickedStations] = useState<Station[]>([])
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const canvas = canvasRef.current
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
        const canvas = canvasRef.current
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
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        if (linesRef.current.length > 0) {
            const cachedTrains: Train[] = []
            linesRef.current.forEach(line => {
                const train = genTrain({ fromTo: [line], context })

                cachedTrains.push(train)
            })

            trainsRef.current = cachedTrains
        }

        handleTrain({ trains: trainsRef.current, context, lines: linesRef.current, stations: stationsRef.current, canvas: canvasRef.current })

    }, [linesRef.current.length])

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
                        onChange={async() => {
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
                ref={canvasRef}
                onClick={(event) => handleCanvasClick({ event, canvasRef, stationsRef, clickedStations, setClickedStations })}
                onContextMenu={(event) => handleContextMenu({ event, canvasRef, linesRef, stationsRef, setClickedStations })}
                onMouseMove={(event) => handleMouseMove({ event, canvasRef, stationsRef, linesRef, clickedStations })}
            />
            <Toaster
                position="bottom-right"
                closeButton={true}
            />
        </>
    )
}