import { Shapes } from "./utils/shapes"

const MARGIN = 200
const STATIONS_NUMBER = 50

const CANVAS_WIDTH = 5_000
const CANVAS_HEIGHT = 5_000

const SHAPES = ["square", "circle", "triangle", "star"] as Shapes[]

const config = {
    MARGIN,
    STATIONS_NUMBER,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    SHAPES
}

export default config
export {
    config,

    MARGIN,
    STATIONS_NUMBER,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    SHAPES
}