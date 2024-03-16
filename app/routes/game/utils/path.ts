import { Line } from "./line"
import { LineTrain, Train } from "./train"
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

function getTrainPath({ train }: { train: Train }) {
    const { lines } = train

    const canLoop = lines[0].from.id === lines[lines.length - 1].to.id

    console.log("getPath", { canLoop })

    // Get the path for each line in the order
    // Every positive order is after the start
    // Every negative order is before the start
    
    const pathAfter: Path[] = []
    for (const line of lines) {
        if (line.order < 0) continue

        const linePath = getPathLine({ line })

        pathAfter.push(...linePath)
    }
    
    const linesSorted = [...lines].sort((a, b) => b.order - a.order)

    const pathBefore: Path[] = []
    for (const line of linesSorted) {
        if (line.order >= 0) continue

        const linePath = getPathLine({ line: reverseFromTo(line) })

        pathBefore.push(...linePath)
    }

    if (canLoop) {
        // const linePath = getPathLine({ line: reverseFromTo(lines[0]) })

        // pathBefore.push(...linePath)

        return [...pathAfter, ...pathBefore.reverse()]
    }

    return [...pathAfter, ...pathAfter.reverse(), ...pathBefore, ...pathBefore.reverse()]
}

function reverseFromTo(line: LineTrain | Line) {
    return {
        ...line,
        from: line.to,
        to: line.from
    }
}

export { 
    getPath, 
    getTrainPath, 
    getPathLine,
    reverseFromTo
}

export type { Path }