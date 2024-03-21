import { MouseEvent } from "react"
import seedrandom from "seedrandom"
import { v4 as uuid } from "uuid"

import { circle, square, star, triangle } from "./shapes"
import { getRandomPosition, getRandomShape } from "./utils"
import { CANVAS_HEIGHT, CANVAS_WIDTH, SHAPES, STATIONS_NUMBER } from "../config"
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

const drawSeedStations = ({ seed, context }: { seed?: string, context: CanvasRenderingContext2D }) => {
    const rng = seedrandom(seed)

    console.log("Seed:", seed, rng(), rng.int32())

    const MAX_X = CANVAS_WIDTH
    const MAX_Y = CANVAS_HEIGHT

    const shapes = SHAPES

    const MIN_STATIONS = 20
    const MAX_STATIONS = 100

    const stationsNumber = Math.floor(rng() * (MAX_STATIONS - MIN_STATIONS) + MIN_STATIONS)

    console.log("Stations number:", stationsNumber)

    const stations: Station[] = Array.from({ length: stationsNumber }, (_, i) => {
        // console.log(station, i)

        const x = Math.floor(rng() * MAX_X + i * rng())
        const y = Math.floor(rng() * MAX_Y + i * rng())
        const shape = shapes[Math.floor(rng() * shapes.length)]
        const id = uuid()

        if (MAX_X <= x || MAX_Y <= y) console.log(x, y, i)

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

const coordHasStation = ({ event, stations, canvas, scale }: { event: MouseEvent | MouseEvent<HTMLCanvasElement>, stations: Station[], canvas: HTMLCanvasElement, scale: number }) => {
    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = event.clientX - canvasX
    const y = event.clientY - canvasY

    const hasStation = stations.find(station => {
        const stationX = station.x * scale
        const stationY = station.y * scale

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
    drawSeedStations,
    drawRandomStations,
    coordHasStation,
    removeHighlightedStations,
    highlightedStations
}

export type {
    Station
}