import { Line } from "./line"
import { Train } from "./train"
import styles from "../style"

interface Path {
    x: number
    y: number
    action: "lineTo" | "moveTo"
}

function getPathLine({ line }: { line: Line }) {
    const { from, to } = line

    const path = getPath({ from, to })

    return path
}

interface getPathProps {
    from: { x: number, y: number }
    to: { x: number, y: number }
}

function getPath({ from, to }: getPathProps) {
    const { width: stationWidth } = styles.stations
    const stationMiddle = stationWidth / 2

    const path: Path[] = [{
        x: from.x + stationMiddle,
        y: from.y + stationMiddle,
        action: "moveTo"
    }, {
        x: from.x + stationMiddle,
        y: to.y + stationMiddle,
        action: "lineTo"
    }, {
        x: to.x + stationMiddle,
        y: to.y + stationMiddle,
        action: "lineTo"
    }]

    return path
}

function getTrainPath({ train, reverse }: { train: Train, reverse: boolean }) {
    const { lines } = train

    const path: Path[] = []

    for (const line of lines) {
        const linePath = getPathLine({ line })
        const reversedPath = linePath.slice().reverse()

        if (reverse) linePath.reverse()

        path.push(...linePath, ...reversedPath)
    }

    return path
}

export { 
    getPath, 
    getTrainPath, 
    getPathLine 
}

export type { Path }