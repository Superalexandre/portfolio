import { MouseEvent, MutableRefObject, RefObject } from "react"

import { Line, clearTempLine, coordHasLine, drawTempLine } from "../utils/line"
import { Station, coordHasStation } from "../utils/station"

interface handleMouseMoveProps {
    event: MouseEvent<HTMLCanvasElement>
    mainLayer: RefObject<HTMLCanvasElement>
    trainLayer: RefObject<HTMLCanvasElement>
    stationsRef: MutableRefObject<Station[]>
    linesRef: MutableRefObject<Line[]>
    clickedStations: Station[]
    smallScreen: boolean
}

const handleMouseMove = ({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations, smallScreen }: handleMouseMoveProps) => {
    const canvas = mainLayer.current
    const trainCanvas = trainLayer.current

    const context = canvas?.getContext("2d")

    if (!context || !canvas || !trainCanvas) return

    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = event.clientX - canvasX
    const y = event.clientY - canvasY

    const hoveredStation = coordHasStation({ event, stations: stationsRef.current, canvas })
    const hoveredLine = coordHasLine({ event, lines: linesRef.current, canvas })

    const hovered = hoveredStation || hoveredLine.hasLine

    canvas.style.cursor = (hovered) ? "pointer" : "default"
    trainCanvas.style.cursor = (hovered) ? "pointer" : "default"

    // If the user is creating a line
    if (clickedStations.length === 1 && !smallScreen) {
        // console.log("Creating temp line")

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