import { MouseEvent } from "react"
import { v4 as uuid } from "uuid"

import { Station, drawStations } from "./station"
import styles, { LineColor } from "../style"

interface Line {
    id: string
    from: Station
    to: Station
    color: LineColor
}

const drawLines = ({ lines, context }: { lines: Line[], context: CanvasRenderingContext2D }) => {
    const { lineWidth } = styles.lines
    const { width: stationWidth } = styles.stations

    lines.forEach(line => {
        context.strokeStyle = line.color
        context.lineWidth = lineWidth

        const stationMiddle = stationWidth / 2

        context.beginPath()
        context.moveTo(line.from.x + stationMiddle, line.from.y + stationMiddle)
        context.lineTo(line.to.x + stationMiddle, line.to.y + stationMiddle)
        context.stroke()
    })
}

const drawLine = ({ from, to, context }: { from: Station, to: Station, context: CanvasRenderingContext2D }): Line => {
    const id = uuid()
    const { getColor } = styles.lines

    const line: Line = {
        id,
        from,
        to,
        color: getColor()
    }

    drawLines({ lines: [line], context })

    return line
}

const drawTempLine = ({ from, to, context }: { from: Station, to: { x: number, y: number }, context: CanvasRenderingContext2D }) => {
    const { getColor } = styles.lines

    const line: Line = {
        id: "temp",
        color: getColor(true),
        from,
        to: {
            id: "cursor",
            x: to.x,
            y: to.y,
            shape: "circle"
        }
    }

    drawLines({ lines: [line], context })

    return line
}

const checkIfLineExists = (lines: Line[], stations: Station[]) => {
    return lines.some(line => {
        const isSameFrom0 = line.from.id === stations[0].id
        const isSameTo1 = line.to.id === stations[1].id

        const isSameFrom1 = line.from.id === stations[1].id
        const isSameTo0 = line.to.id === stations[0].id

        return (isSameFrom0 && isSameTo1) || (isSameFrom1 && isSameTo0)
    })
}

const clearTempLine = ({ context, stations, lines }: { context: CanvasRenderingContext2D, stations: Station[], lines: Line[] }) => {
    const tempLine = lines.find(line => line.id === "temp")
    if (tempLine) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        lines = lines.filter(line => line.id !== "temp")

        drawStations({ stations, context })
        drawLines({ lines, context })
    }

    return lines
}

const coordHasLine = ({ event, lines, canvas }: { event: MouseEvent | MouseEvent<HTMLCanvasElement>, lines: Line[], canvas: HTMLCanvasElement }) => {
    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = event.clientX - canvasX
    const y = event.clientY - canvasY

    const hasLine = lines.find(line => {
        const { from, to } = line

        const isSameX = x >= from.x && x <= to.x
        const isSameY = y >= from.y && y <= to.y

        return isSameX && isSameY
    })

    return hasLine
}

export {
    drawLines,
    drawLine,
    drawTempLine,
    checkIfLineExists,
    clearTempLine,
    coordHasLine
}

export type {
    Line
}