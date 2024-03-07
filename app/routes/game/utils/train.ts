import { v4 as uuid } from "uuid"

import { Line, drawLines } from "./line"
import { Station, drawStations } from "./station"
import styles from "../style"

// TODO: Should be handled by a useState
const speed = 1

interface Train {
    id: string

    x: number
    y: number

    fromTo: Line[]
}

const genTrain = ({ fromTo, context }: { fromTo: Line[], context: CanvasRenderingContext2D }): Train => {
    const id = uuid()

    const [from] = fromTo

    const x = from.from.x
    const y = from.from.y

    const train: Train = {
        id,
        x,
        y,
        fromTo
    }

    drawTrain({ train: train, context })

    return train
}

const drawTrain = ({ train, context }: { train: Train, context: CanvasRenderingContext2D }) => {
    const { x, y } = train

    context.fillStyle = "black"
    context.beginPath()
    context.arc(x, y, 5, 0, Math.PI * 2)
    context.fill()
}

interface handleTrainProps {
    context: CanvasRenderingContext2D
    trains: Train[]
    canvas: HTMLCanvasElement
    stations: Station[]
    lines: Line[]
}

const handleTrain = ({ trains, stations, lines, context, canvas }: handleTrainProps) => {
    const stationMiddle = styles.stations.width / 2

    trains.forEach(train => {
        const interval = setInterval(() => {
            context.clearRect(0, 0, canvas.height, canvas.width)

            drawLines({ lines, context })
            drawStations({ stations, context })

            const [, to] = train.fromTo
            const goTo = to.to

            context.fillStyle = "blue"
            context.beginPath()
            context.arc(train.x, train.y, 10, 0, 2 * Math.PI)
            context.fill()

            if (train.y - stationMiddle < goTo.y) {
                // console.log("Moving down")


                train.y += speed
            } else if (train.y - stationMiddle > goTo.y) {
                // console.log("Moving up")


                train.y -= speed
            } else if (train.x - stationMiddle < goTo.x) {
                // console.log("Moving right")


                train.x += speed
            } else if (train.x - stationMiddle > goTo.x) {
                // console.log("Moving left")


                train.x -= speed
            } else {
                clearInterval(interval)
            }
        })
    }, 1000 / 60)
}

export {
    genTrain,
    drawTrain,
    handleTrain
}

export type {
    Train
}