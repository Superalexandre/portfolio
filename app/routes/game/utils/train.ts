import { MutableRefObject } from "react"
import { v4 as uuid } from "uuid"

import { Line } from "./line"
import { Path, getTrainPath } from "./path"
// import { Station } from "./station"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config"
import styles from "../style"

interface LineTrain extends Line {
    // If the new line is connected to the start of the train line
    order: number
}

interface Train {
    id: string

    x: number
    y: number

    color: string

    path: Path[] | null
    onPath: number

    lines: LineTrain[]
}

const genTrain = ({ lines }: { lines: LineTrain[] }): Train => {
    const { width: stationWidth } = styles.stations
    const stationMiddle = stationWidth / 2

    const id = uuid()

    const from = lines[0].from

    const x = from.x + stationMiddle
    const y = from.y + stationMiddle

    const train: Train = {
        id,
        x,
        y,

        color: lines[0].color,

        path: null,
        onPath: 0,

        lines: lines
    }

    return train
}

const drawTrain = ({ train, context }: { train: Train, context: CanvasRenderingContext2D }) => {
    const { x, y } = train

    context.fillStyle = "red"
    context.beginPath()
    context.arc(x, y, 10, 0, Math.PI * 2)
    context.fill()
}

interface handleTrainProps {
    context: CanvasRenderingContext2D
    trains: MutableRefObject<Train[]>
    ms: number
}

const handleTrain = ({ trains, context, ms }: handleTrainProps) => {
    const interval = setInterval(() => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        const newTrains: Train[] = trains.current.map((train) => {
            const pathNumber = train.onPath

            if (!train.path) train.path = getTrainPath({ train })

            const path = train.path

            const { x, y } = path[pathNumber]

            let newX = train.x
            let newY = train.y

            drawTrain({ train, context })

            if (train.y < y) {
                // console.log("Moving down")

                newY += 1
            } else if (train.y > y) {
                // console.log("Moving up")

                newY -= 1
            } else if (train.x < x) {
                // console.log("Moving right")

                newX += 1
            } else if (train.x > x) {
                // console.log("Moving left")

                newX -= 1
            } else {
                train.onPath++

                if (train.onPath >= path.length) train.onPath = 0
            }

            return { ...train, x: newX, y: newY }
        })

        trains.current = newTrains
    }, ms)

    return { interval }
}

const deleteLineFromTrain = (trains: Train[], line: Line) => {
    const newTrains = []
    const removeLines: Line[] = []

    for (const train of trains) {
        const indexLine = train.lines.findIndex(trainLine => trainLine.id === line.id)

        if (indexLine === -1) {
            newTrains.push(train)
            continue
        }

        if (indexLine !== 0 && indexLine !== train.lines.length - 1) {
            console.log("Can't delete line from the middle of the train")

            newTrains.push(train)

            continue
        }
        
        train.lines.splice(indexLine, 1)
        removeLines.push(line)

        if (train.lines.length > 0) {
            train.path = getTrainPath({ train })
            
            if (train.onPath >= train.path.length) train.onPath = train.path.length - 1

            newTrains.push(train)
        }
    }

    return { newTrains, removeLines }
}

const canConnect = ({ trains, line }: { trains: Train[], line: Line }) => {
    // Check if the new line can connect to any of the trains

    const canConnectResult = trains.map(train => {
        // console.log("train", train, line)

        const { lines } = train

        const firstStation = lines[0]
        const lastStation = lines[lines.length - 1]

        const canConnectStart = firstStation.from.id === line.from.id
        const canConnectEnd = lastStation.to.id === line.from.id

        const sameColor = train.color === line.color

        // Accept only one of the start or end
        // const canConnectStation = canConnectStart && canConnectEnd ? false : canConnectStart || canConnectEnd
        const canConnectStation = (canConnectStart || canConnectEnd) && sameColor

        return {
            train,
            canConnect: canConnectStation,
            station: canConnectStart ? firstStation : lastStation,
            isStart: canConnectStart,
            isEnd: canConnectEnd
        }
    }).filter(result => result.canConnect !== false)

    // console.log("canConnectResult", canConnectResult)

    return canConnectResult
}

export {
    genTrain,
    drawTrain,
    handleTrain,
    deleteLineFromTrain,
    canConnect
}

export type {
    Train,
    LineTrain
}