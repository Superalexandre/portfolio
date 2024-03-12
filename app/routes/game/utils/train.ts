import { MutableRefObject } from "react"
import { v4 as uuid } from "uuid"

import { Line } from "./line"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config"
import styles from "../style"

interface Train {
    id: string

    x: number
    y: number

    station: number
    fromTo: Line[]
}

const genTrain = ({ fromTo }: { fromTo: Line[] }): Train => {
    const id = uuid()

    const [from] = fromTo

    const x = from.from.x
    const y = from.from.y

    const train: Train = {
        id,
        x,
        y,
        station: 0,
        fromTo
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
    trains: MutableRefObject<Train[]>,
    speed: number
}

const handleTrain = ({ trains, context, speed }: handleTrainProps) => {
    const stationMiddle = styles.stations.width / 2

    const interval = setInterval(() => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        
        const newTrains: Train[] = trains.current.map((train) => {
            const stationNumber = train.station
            const { to } = train.fromTo[stationNumber]

            drawTrain({ train, context })

            let newX = train.x
            let newY = train.y

            if (train.y - stationMiddle < to.y) {
                // console.log("Moving down")

                newY += speed
            } else if (train.y - stationMiddle > to.y) {
                // console.log("Moving up")

                newY -= speed
            } else if (train.x - stationMiddle < to.x) {
                // console.log("Moving right")

                newX += speed
            } else if (train.x - stationMiddle > to.x) {
                // console.log("Moving left")

                newX -= speed
            }

            return { ...train, x: newX, y: newY }
        })

        trains.current = newTrains
    }, 1000 / 60)

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