import { MutableRefObject } from "react"
import { v4 as uuid } from "uuid"

import { Line } from "./line"
import { getTrainPath } from "./path"
import { Station } from "./station"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config"
import styles from "../style"

type FullStation = { station: Station, line: Line }

interface Train {
    id: string

    x: number
    y: number

    reverse: boolean
    onStation: number
    onPath: number

    stations: FullStation[]
    lines: Line[]
}

const genTrain = ({ stations, lines }: { stations: FullStation[], lines: Line[] }): Train => {
    const { width: stationWidth } = styles.stations
    const stationMiddle = stationWidth / 2

    const id = uuid()

    const from = stations[0].station

    const x = from.x + stationMiddle
    const y = from.y + stationMiddle

    const train: Train = {
        id,
        x,
        y,

        reverse: false,
        onStation: 0,
        onPath: 0,

        stations,
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

            const path = getTrainPath({ train, reverse: false })
            
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

export {
    genTrain,
    drawTrain,
    handleTrain
}

export type {
    Train
}