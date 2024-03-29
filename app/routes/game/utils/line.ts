import { MouseEvent } from "react"
import { v4 as uuid } from "uuid"

import { PendingRequestRef, saveDatabase } from "./database"
import { getPathLine } from "./path"
import { Station, drawStations, getStation } from "./station"
import { LineTrain } from "./train"
import styles, { LineColor } from "../style"

interface Line {
    id: string
    gameId?: string
    from: Station | string
    to: Station | string
    color: LineColor
}

const drawLines = ({ stations, lines, context }: { stations: Station[], lines: Line[], context: CanvasRenderingContext2D }) => {
    const { lineWidth } = styles.lines

    lines.forEach(line => {
        context.strokeStyle = line.color
        context.lineWidth = lineWidth

        const paths = getPathLine({ stations, line })

        context.beginPath()

        for (const path of paths) {
            const { x, y, action } = path

            context[action](x, y)
        }

        context.stroke()
    })
}

const drawLine = ({ stations, from, to, gameId, context, color }: { stations: Station[], from: Station, to: Station, gameId?: string, context: CanvasRenderingContext2D, color: LineColor }): Line => {
    const id = uuid()

    const line: Line = {
        id,
        gameId,
        from: getStation(stations, from),
        to: getStation(stations, to),
        color: color
    }

    drawLines({ stations, lines: [line], context })

    return line
}

const drawTempLine = ({ stations, from, to, context }: { stations: Station[], from: Station, to: { x: number, y: number }, context: CanvasRenderingContext2D }) => {
    const { getColor } = styles.lines

    const line: Line = {
        id: "temp",
        color: getColor(true),
        from,
        to: {
            id: "cursor",
            x: to.x,
            y: to.y,
            shape: "circle",
            highlighted: false
        }
    }

    drawLines({ stations, lines: [line], context })

    return line
}

const checkIfLineExists = (allStations: Station[], lines: Line[], clickedStations: Station[], color: string) => {
    return lines.some(line => {
        const fromStation = getStation(allStations, line.from)
        const toStation = getStation(allStations, line.to)

        const isSameFrom0 = fromStation.id === clickedStations[0].id
        const isSameTo1 = toStation.id === clickedStations[1].id

        const isSameFrom1 = fromStation.id === clickedStations[1].id
        const isSameTo0 = toStation.id === clickedStations[0].id

        const isSameColor = line.color === color

        return (isSameFrom0 && isSameTo1 && isSameColor) || (isSameFrom1 && isSameTo0 && isSameColor)
    })
}

const clearTempLine = ({ context, stations, lines }: { context: CanvasRenderingContext2D, stations: Station[], lines: Line[] }) => {
    const tempLine = lines.find(line => line.id === "temp")
    if (tempLine) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        lines = lines.filter(line => line.id !== "temp")

        drawStations({ stations, context })
        drawLines({ stations, lines, context })
    }

    return lines
}

const coordHasLine = ({ stations, event, lines, canvas, scale }: { stations: Station[], event: MouseEvent | MouseEvent<HTMLCanvasElement> | MouseEvent<HTMLDivElement>, lines: Line[], canvas: HTMLCanvasElement, scale: number }) => {
    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = (event.clientX - canvasX) / scale
    const y = (event.clientY - canvasY) / scale

    let foundLine: Line | undefined

    const hasLine = lines.some(line => {
        const paths = getPathLine({ stations, line })

        return paths.some((path, index) => {
            const nextPath = index === paths.length - 1 ? paths[index - 1] : paths[index + 1]

            const padding = styles.lines.lineWidth * 2

            const isSameXUp = x >= path.x - padding && x <= nextPath.x + padding
            const isSameXDown = x >= nextPath.x - padding && x <= path.x + padding

            const isSameX = isSameXUp || isSameXDown

            const isSameYUp = y >= path.y - padding && y <= nextPath.y + padding
            const isSameYDown = y >= nextPath.y - padding && y <= path.y + padding

            const isSameY = isSameYUp || isSameYDown

            if (isSameX && isSameY && !foundLine) foundLine = line

            return isSameX && isSameY
        })
    })

    return { hasLine, line: foundLine }
}

const deleteLines = (lines: Line[], deletedLine: Line[], pendingRequest: PendingRequestRef) => {
    const newLines = []

    for (const line of lines) {
        const isDeleted = deletedLine.some(deleted => deleted.id === line.id)

        if (!isDeleted) newLines.push(line)

        if (isDeleted && line.gameId) {
            const req = saveDatabase({ type: "line", action: "delete", gameId: line.gameId, data: line, id: line.id })
        
            pendingRequest.current.push(req)
        }
    }

    return newLines
}

const reverseFromTo = (line: LineTrain | Line) => {
    return {
        ...line,
        from: line.to,
        to: line.from
    }
}

export {
    drawLines,
    drawLine,
    drawTempLine,
    checkIfLineExists,
    clearTempLine,
    coordHasLine,
    deleteLines,
    reverseFromTo
}

export type {
    Line
}