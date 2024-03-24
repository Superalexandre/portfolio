import { Dispatch, MouseEvent, MutableRefObject, RefObject, SetStateAction } from "react"

import { Line, clearTempLine, coordHasLine, deleteLines, drawLines } from "../utils/line"
import { Station, coordHasStation, drawStations } from "../utils/station"
import { Train, deleteLineFromTrain } from "../utils/train"

interface handleCanvasClickProps {
    event: MouseEvent<HTMLCanvasElement>
    mainLayer: RefObject<HTMLCanvasElement>
    stationsRef: MutableRefObject<Station[]>
    linesRef: MutableRefObject<Line[]>
    trainsRef: MutableRefObject<Train[]>
    clickedStations: Station[]
    setClickedStations: Dispatch<SetStateAction<Station[]>>
    scale: number
}

const handleCanvasClick = ({ event, mainLayer, stationsRef, linesRef, trainsRef, clickedStations, setClickedStations, scale }: handleCanvasClickProps) => {
    const canvas = mainLayer.current
    const context = canvas?.getContext("2d")

    if (!context || !canvas) return

    const clickedStation = coordHasStation({ event, stations: stationsRef.current, canvas, scale })
    if (clickedStation) {
        const isAlreadyClicked = clickedStations.some(station => station.id === clickedStation.id)
        if (isAlreadyClicked) {
            linesRef.current = clearTempLine({ context, stations: stationsRef.current, lines: linesRef.current })

            clickedStation.highlighted = false
            setClickedStations((prev) => prev.filter(station => station.id !== clickedStation.id))

            return
        }

        if (clickedStation && clickedStations.length === 0) clickedStation.highlighted = true

        setClickedStations((prev) => [...prev, clickedStation])

        return
    }

    const clickedLine = coordHasLine({ stations: stationsRef.current, event, lines: linesRef.current, canvas, scale })
    if (clickedLine.hasLine && clickedStations.length === 0) {
        if (!clickedLine.line) return

        const { newTrains, removeLines } = deleteLineFromTrain(stationsRef.current, trainsRef.current, clickedLine.line)
        // const newLines = linesRef.current.filter(line => line.id !== clickedLine.line?.id)
        const newLines = deleteLines(linesRef.current, [...removeLines])

        console.log("newTrain", newTrains)

        linesRef.current = newLines
        trainsRef.current = newTrains

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        drawStations({ stations: stationsRef.current, context })
        drawLines({ stations: stationsRef.current, lines: linesRef.current, context })
    }
}

export {
    handleCanvasClick
}