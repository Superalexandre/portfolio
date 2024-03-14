import { Dispatch, MouseEvent, MutableRefObject, RefObject, SetStateAction } from "react"

import { Line, clearTempLine, coordHasLine, drawLines } from "../utils/line"
import { Station, coordHasStation, drawStations } from "../utils/station"
import { Train, deleteTrainFromLine } from "../utils/train"

interface handleCanvasClickProps {
    event: MouseEvent<HTMLCanvasElement>
    mainLayer: RefObject<HTMLCanvasElement>
    stationsRef: MutableRefObject<Station[]>
    linesRef: MutableRefObject<Line[]>
    trainsRef: MutableRefObject<Train[]>
    clickedStations: Station[]
    setClickedStations: Dispatch<SetStateAction<Station[]>>
}

const handleCanvasClick = ({ event, mainLayer, stationsRef, linesRef, trainsRef, clickedStations, setClickedStations }: handleCanvasClickProps) => {
    const canvas = mainLayer.current
    const context = canvas?.getContext("2d")

    if (!context || !canvas) return

    const clickedStation = coordHasStation({ event, stations: stationsRef.current, canvas })
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

    const clickedLine = coordHasLine({ event, lines: linesRef.current, canvas })
    if (clickedLine.hasLine) {
        if (!clickedLine.line) return

        const newLines = linesRef.current.filter(line => line.id !== clickedLine.line?.id)
        const newTrain = deleteTrainFromLine(trainsRef.current, clickedLine.line)

        linesRef.current = newLines
        trainsRef.current = newTrain

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        drawStations({ stations: stationsRef.current, context })
        drawLines({ lines: linesRef.current, context })
    }
}

export {
    handleCanvasClick
}