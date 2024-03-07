import { MouseEvent } from "react"

import { Line, clearTempLine, drawTempLine } from "../utils/line"
import { Station, coordHasStation } from "../utils/station"

interface handleMouseMoveProps {
    event: MouseEvent<HTMLCanvasElement>
    canvasRef: React.RefObject<HTMLCanvasElement>
    stationsRef: React.MutableRefObject<Station[]>
    linesRef: React.MutableRefObject<Line[]>
    clickedStations: Station[]
}

const handleMouseMove = ({ event, canvasRef, stationsRef, linesRef, clickedStations }: handleMouseMoveProps) => {
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
}


export {
    handleMouseMove
}