import { Dispatch, MouseEvent, MutableRefObject, RefObject, SetStateAction } from "react"

import { Line, clearTempLine } from "../utils/line"
import { Station, removeHighlightedStations } from "../utils/station"

interface handleContextMenuProps {
    event: MouseEvent<HTMLCanvasElement>
    mainLayer: RefObject<HTMLCanvasElement>
    stationsRef: MutableRefObject<Station[]>
    linesRef: MutableRefObject<Line[]>
    setClickedStations: Dispatch<SetStateAction<Station[]>>
}

const handleContextMenu = ({ event, mainLayer, linesRef, stationsRef, setClickedStations }: handleContextMenuProps) => {
    const canvas = mainLayer.current
    const context = canvas?.getContext("2d")

    if (!context || !canvas) return

    event.preventDefault()

    stationsRef.current = removeHighlightedStations(stationsRef.current)

    const tempLine = linesRef.current.find(line => line.id === "temp")
    if (tempLine) linesRef.current = clearTempLine({ context, stations: stationsRef.current, lines: linesRef.current })

    setClickedStations([])
}

export {
    handleContextMenu
}