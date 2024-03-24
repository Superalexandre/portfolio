import { MouseEvent } from "react"
import seedrandom from "seedrandom"
import { v4 as uuid } from "uuid"

import { Shapes, circle, square, star, triangle } from "./shapes"
import { getRandomPosition, getRandomShape } from "./utils"
import { SHAPES, STATIONS_NUMBER } from "../config"
import styles from "../style"

interface Station {
    id: string
    gameId?: string
    x: number
    y: number
    shape: Shapes
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

const getSeedStations = ({ seed, canvasWidth, canvasHeight }: { seed?: string, canvasWidth: number, canvasHeight: number }) => {
    const rng = seedrandom(seed)

    const MAX_X = canvasWidth
    const MAX_Y = canvasHeight

    const shapes = SHAPES

    const MIN_STATIONS = 20
    const MAX_STATIONS = 100

    const stationsNumber = Math.floor(rng() * (MAX_STATIONS - MIN_STATIONS) + MIN_STATIONS)

    const stations: Station[] = Array.from({ length: stationsNumber }, (_, i) => {
        const x = Math.floor(rng() * MAX_X + i * rng())
        const y = Math.floor(rng() * MAX_Y + i * rng())
        const shape = shapes[Math.floor(rng() * shapes.length)]
        const id = uuid()

        return {
            x,
            y,
            id,
            shape,
            highlighted: false
        }
    })

    return stations
}

const drawSeedStations = ({ seed, context }: { seed?: string, context: CanvasRenderingContext2D }) => {
    const stations = getSeedStations({ seed, canvasWidth: context.canvas.width, canvasHeight: context.canvas.height })

    drawStations({ context, stations })

    return stations
}

const drawRandomStations = ({ number = STATIONS_NUMBER, context }: { number?: number, context: CanvasRenderingContext2D }): Station[] => {
    const stations: Station[] = Array.from({ length: number }, () => {
        const { x, y } = getRandomPosition({ canvasWidth: context.canvas.width, canvasHeight: context.canvas.height })
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

const getStation = (stations: Station[], id: string | Station) => {
    if (typeof id !== "string") return id
    
    // console.log(stations)

    const station = stations.find(stationFind => stationFind.id === id)

    return station as Station 

    // return stations.find(station => station.id === id)
}

export {
    drawStations,
    getSeedStations,
    drawSeedStations,
    drawRandomStations,
    coordHasStation,
    removeHighlightedStations,
    highlightedStations,
    getStation
}

export type {
    Station
}