import { MouseEvent } from "react"
import { v4 as uuid } from "uuid"

import { getPathLine } from "./path"
import { Station, drawStations } from "./station"
import { LineTrain } from "./train"
import styles, { LineColor } from "../style"

interface Line {
    id: string
    from: Station
    to: Station
    color: LineColor
}

const drawLines = ({ lines, context }: { lines: Line[], context: CanvasRenderingContext2D }) => {
    const { lineWidth } = styles.lines

    lines.forEach(line => {
        context.strokeStyle = line.color
        context.lineWidth = lineWidth

        const paths = getPathLine({ line })

        context.beginPath()

        for (const path of paths) {
            const { x, y, action } = path

            context[action](x, y)
        }

        context.stroke()
    })
}

const drawLine = ({ from, to, context, color }: { from: Station, to: Station, context: CanvasRenderingContext2D, color: LineColor }): Line => {
    const id = uuid()

    const line: Line = {
        id,
        from,
        to,
        color: color
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
            shape: "circle",
            highlighted: false
        }
    }

    drawLines({ lines: [line], context })

    return line
}

const checkIfLineExists = (lines: Line[], stations: Station[], color: string) => {
    return lines.some(line => {
        const isSameFrom0 = line.from.id === stations[0].id
        const isSameTo1 = line.to.id === stations[1].id

        const isSameFrom1 = line.from.id === stations[1].id
        const isSameTo0 = line.to.id === stations[0].id

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
        drawLines({ lines, context })
    }

    return lines
}

const coordHasLine = ({ event, lines, canvas }: { event: MouseEvent | MouseEvent<HTMLCanvasElement>, lines: Line[], canvas: HTMLCanvasElement }) => {
    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = event.clientX - canvasX
    const y = event.clientY - canvasY

    let foundLine: Line | undefined

    const hasLine = lines.some(line => {
        const paths = getPathLine({ line })

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

const deleteLines = (lines: Line[], deletedLine: Line[]) => {
    const newLines = []

    for (const line of lines) {
        const isDeleted = deletedLine.some(deleted => deleted.id === line.id)

        if (!isDeleted) newLines.push(line)
    }

    return newLines
}

function reverseFromTo(line: LineTrain | Line) {
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