import { MutableRefObject } from "react"
import { v4 as uuid } from "uuid"

import { Line, reverseFromTo } from "./line"
import { Path, getTrainPath } from "./path"
import { Station, getStation } from "./station"
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

const genTrain = ({ stations, lines }: { stations: Station[], lines: LineTrain[] }): Train => {
    const { width: stationWidth } = styles.stations
    const stationMiddle = stationWidth / 2

    const id = uuid()

    const from = getStation(stations, lines[0].from)

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
    stations: Station[]
    context: CanvasRenderingContext2D
    trains: MutableRefObject<Train[]>
    ms: number
}

const handleTrain = ({ stations, trains, context, ms }: handleTrainProps) => {
    const interval = setInterval(() => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        const newTrains: Train[] = trains.current.map((train) => {
            const pathNumber = train.onPath

            if (!train.path) train.path = getTrainPath({ stations, train })

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

const deleteLineFromTrain = (stations: Station[], trains: Train[], line: Line) => {
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
            train.path = getTrainPath({ stations, train })
            
            if (train.onPath >= train.path.length) train.onPath = train.path.length - 1

            newTrains.push(train)
        }
    }

    return { newTrains, removeLines }
}

const canConnect = ({ stations, trains, line }: { stations: Station[], trains: Train[], line: Line }) => {
    // Check if the new line can connect to any of the trains

    const canConnectResult = trains.map(train => {
        // console.log("train", train, line)

        const { lines } = train

        const firstStation = lines[0]
        const lastStation = lines[lines.length - 1]

        const lineFrom = getStation(stations, line.from)

        const firstStationFrom = getStation(stations, firstStation.from)
        const lastStationTo = getStation(stations, lastStation.to)

        const canConnectStart = firstStationFrom.id === lineFrom.id
        const canConnectEnd = lastStationTo.id === lineFrom.id

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

interface retrieveTrainsProps {
    stations: Station[]
    // trainsRef: MutableRefObject<Train[]>
    lines: Line[]
}

const retrieveTrains = ({ stations, lines }: retrieveTrainsProps) => {
    const newTrains = []
    for (const [lineIndex, line] of lines.entries()) {
        if (lineIndex === 0) {
            const newTrain = genTrain({
                stations: stations,
                lines: [{
                    ...line,
                    order: 0
                }]
            })

            // trainsRef.current.push(newTrain)
            newTrains.push(newTrain)

            continue
        }

        const canConnectToOtherTrain = canConnect({ stations, trains: newTrains, line })

        if (canConnectToOtherTrain.length > 0) {
            if (canConnectToOtherTrain.length > 1) {
                console.error("!! More than one train can connect to the line !!")
            
                
            }
                

            const canConnectResult = canConnectToOtherTrain[0]
            if (!canConnectResult.canConnect) continue

            const { train, isStart } = canConnectResult

            if (isStart) {
                const reversedLine = reverseFromTo(line)

                const lastOrder = train.lines.length > 0 ? train.lines[0].order : 0
                const newOrder = lastOrder - 1

                train.lines.splice(0, 0, {
                    ...reversedLine,
                    order: newOrder
                })
            } else {
                const order = train.lines.filter(lineFilter => lineFilter.order < 0).length + 1

                train.lines.push({
                    ...line,
                    order
                })
            }

            train.path = getTrainPath({ stations, train })

            // trainsRef.current[trainsRef.current.indexOf(train)] = train
            newTrains[newTrains.indexOf(train)] = train
        } else {
            // const lineInTrain = trainsRef.current.some(train => train.lines.some(trainLine => trainLine.id === line.id))
            const lineInTrain = newTrains.some(train => train.lines.some(trainLine => trainLine.id === line.id))

            if (lineInTrain) continue

            const newTrain = genTrain({
                stations: stations,
                lines: [{
                    ...line,
                    order: 0
                }]
            })

            // trainsRef.current.push(newTrain)
            newTrains.push(newTrain)
        }
    }

    return newTrains

    /*
    if (realLines.length > 0) {
        // Check if the new line is the same color as the previous one and if its the same stations
        const lastLine = realLines[realLines.length - 1]

        const canConnectToOtherTrain = canConnect({ stations: stationsRef.current, trains: trainsRef.current, line: lastLine })

        if (canConnectToOtherTrain.length > 0) {
            if (canConnectToOtherTrain.length > 1) return console.error("!! More than one train can connect to the line !!")

            const canConnectResult = canConnectToOtherTrain[0]
            if (!canConnectResult.canConnect) return

            console.log("Can connect to another train")

            const { train, isStart } = canConnectResult

            if (isStart) {
                console.log("Is start")

                const reversedLastLine = reverseFromTo(lastLine)

                const lastOrder = train.lines.length > 0 ? train.lines[0].order : 0
                const newOrder = lastOrder - 1

                train.lines.splice(0, 0, {
                    ...reversedLastLine,
                    order: newOrder,
                })

            } else {
                console.log("Is end", canConnectResult.isEnd)

                const order = train.lines.filter(line => line.order < 0).length + 1

                train.lines.push({
                    ...lastLine,
                    order: order,
                })
            }

            // Update the path
            train.path = getTrainPath({ stations: stationsRef.current, train })

            trainsRef.current[trainsRef.current.indexOf(train)] = train
        } else {
            // Check if the lastLine is already in a train
            const lineInTrain = trainsRef.current.some(train => train.lines.some(line => line.id === lastLine.id))
            if (lineInTrain) return

            const newTrain = genTrain({
                stations: stationsRef.current,
                lines: [{
                    ...lastLine,
                    order: 0,
                }]
            })

            trainsRef.current.push(newTrain)
        }
    }
    */
}

export {
    genTrain,
    drawTrain,
    handleTrain,
    deleteLineFromTrain,
    canConnect,
    retrieveTrains
}

export type {
    Train,
    LineTrain
}