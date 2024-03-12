import { Dispatch, MouseEvent, MutableRefObject, RefObject, SetStateAction } from "react"

import { Station, coordHasStation } from "../utils/station"

interface handleCanvasClickProps {
    event: MouseEvent<HTMLCanvasElement>
    mainLayer: RefObject<HTMLCanvasElement>
    stationsRef: MutableRefObject<Station[]>
    clickedStations: Station[]
    setClickedStations: Dispatch<SetStateAction<Station[]>>
}

const handleCanvasClick = ({ event, mainLayer, stationsRef, clickedStations, setClickedStations }: handleCanvasClickProps) => {
    const canvas = mainLayer.current
    const context = canvas?.getContext("2d")

    if (!context || !canvas) return

    const clickedStation = coordHasStation({ event, stations: stationsRef.current, canvas })
    if (clickedStation) {
        const isAlreadyClicked = clickedStations.some(station => station.id === clickedStation.id)
        if (isAlreadyClicked) return

        setClickedStations((prev) => [...prev, clickedStation])
    }

}

export {
    handleCanvasClick
}