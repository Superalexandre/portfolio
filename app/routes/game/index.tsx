import { MouseEvent, useCallback, useEffect, useRef, useState } from "react"
// import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { Toaster, toast } from "sonner"

import { CANVAS_HEIGHT, CANVAS_WIDTH, STATIONS_NUMBER } from "./config"
import { Line, checkIfLineExists, clearTempLine, drawLine, drawTempLine } from "./utils/line"
import { Station, coordHasStation, drawRandomStations } from "./utils/station"
import { changeTheme, getTheme } from "./utils/utils"

export default function Index() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const stationsRef = useRef<Station[]>([])
    const linesRef = useRef<Line[]>([])

    const [clickedStations, setClickedStations] = useState<Station[]>([])
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const handleCanvasClick = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        const clickedStation = coordHasStation({ event, stations: stationsRef.current, canvas })
        if (clickedStation) {
            const isAlreadyClicked = clickedStations.some(station => station.id === clickedStation.id)
            if (isAlreadyClicked) return
    
            setClickedStations((prev) => [...prev, clickedStation])
        }

    }, [canvasRef, setClickedStations, clickedStations])

    const handleMouseMove = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

        const x = event.clientX - canvasX
        const y = event.clientY - canvasY

        const hoveredStation = coordHasStation({ event, stations: stationsRef.current, canvas })

        canvas.style.cursor = (hoveredStation) ? "pointer" : "default"

        // If the user is creating a line
        if (clickedStations.length === 1) {
            console.log("Creating line")

            // Find the temp line and remove it
            const tempLine = linesRef.current.find(line => line.id === "temp")
            if (tempLine) linesRef.current = clearTempLine({ context, stations: stationsRef.current, lines: linesRef.current })

            const clickedStation = clickedStations[0]

            const lines = drawTempLine({ from: clickedStation, to: { x, y }, context })
            linesRef.current.push(lines)
        }
    }, [canvasRef, clickedStations])

    const handleContextMenu = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        event.preventDefault()
    
        const tempLine = linesRef.current.find(line => line.id === "temp")
        if (tempLine) linesRef.current = clearTempLine({ context, stations: stationsRef.current, lines: linesRef.current })

        setClickedStations([])
    }, [])

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
                onClick={handleCanvasClick}
                onContextMenu={handleContextMenu}
                onMouseMove={handleMouseMove}
            />
            <Toaster
                position="bottom-right"
                closeButton={true}
            />
        </>
    )
}