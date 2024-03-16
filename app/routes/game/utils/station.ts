import { MouseEvent } from "react"
import { v4 as uuid } from "uuid"

import { circle, square, star, triangle } from "./shapes"
import { getRandomPosition, getRandomShape } from "./utils"
import { STATIONS_NUMBER } from "../config"
import styles from "../style"

interface Station {
    x: number
    y: number
    id: string
    shape: string
    highlighted: boolean
}

const drawStations = ({ stations, context }: { stations: Station[], context: CanvasRenderingContext2D }) => {
    const { height, width, getColor } = styles.stations

    stations.forEach(station => {
        const { shape, x, y } = station

        const color = station.highlighted ? "red" : getColor()

        if (shape === "circle") circle({ x, y, width, height, context, color })
        if (shape === "square") square({ x, y, width, height, context, color })
        if (shape === "triangle") triangle({ x, y, width, height, context, color })
        if (shape === "star") star({ x, y, width, height, context, branches: 5, color })
    })
}

const drawRandomStations = ({ number = STATIONS_NUMBER, context }: { number?: number, context: CanvasRenderingContext2D }): Station[] => {
    const stations: Station[] = Array.from({ length: number }, () => {
        const { x, y } = getRandomPosition()
        const shape = getRandomShape()
        const id = uuid()

        return {
            x,
            y,
            id,
            shape,
            highlighted: false
        }
    })

    drawStations({ context, stations })

    return stations
}

const coordHasStation = ({ event, stations, canvas }: { event: MouseEvent | MouseEvent<HTMLCanvasElement>, stations: Station[], canvas: HTMLCanvasElement }) => {
    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = event.clientX - canvasX
    const y = event.clientY - canvasY

    const hasStation = stations.find(station => {
        const { x: stationX, y: stationY } = station

        const isSameX = x >= stationX && x <= stationX + styles.stations.width
        const isSameY = y >= stationY && y <= stationY + styles.stations.width

        return isSameX && isSameY
    })

    return hasStation
}

const removeHighlightedStations = (stations: Station[]) => {
    const newStations = stations.map(station => {
        return {
            ...station,
            highlighted: false
        }
    })

    return newStations
}

const highlightedStations = (stations: Station[], station: Station) => {
    const newStations = stations.map(s => {
        const isSame = s.id === station.id

        return {
            ...s,
            highlighted: isSame
        }
    })

    return newStations
}

export {
    drawStations,
    drawRandomStations,
    coordHasStation,
    removeHighlightedStations,
    highlightedStations
}

export type {
    Station
}