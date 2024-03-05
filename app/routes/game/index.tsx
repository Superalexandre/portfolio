import { MouseEvent, useCallback, useEffect, useRef, useState } from "react"
// import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { Toaster, toast } from "sonner"
import { v4 as uuid } from "uuid"

const MARGIN = 200
const STATIONS_NUMBER = 10

const CANVAS_WIDTH = 2_000
const CANVAS_HEIGHT = 1_000

type Point = {
    x: number
    y: number
    id: string
}

type Line = {
    id: string
    from: Point
    to: Point
}

/*
type Train = {
    onLine: Line
}
*/

export default function Index() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const pointsRef = useRef<Point[]>([])
    const linesRef = useRef<Line[]>([])

    const [clickedPoints, setClickedPoints] = useState<Point[]>([])

    const handleCanvasClick = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        const clickedPoint = coordHasPoint({ event, points: pointsRef.current, canvas })
        if (!clickedPoint) return

        const isAlreadyClicked = clickedPoints.some(point => point.id === clickedPoint.id)
        if (isAlreadyClicked) return

        setClickedPoints((prev) => [...prev, clickedPoint])
    }, [canvasRef, setClickedPoints, clickedPoints])

    const handleMouseMove = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

        const x = event.clientX - canvasX
        const y = event.clientY - canvasY

        const hoveredPoint = coordHasPoint({ event, points: pointsRef.current, canvas })

        canvas.style.cursor = hoveredPoint ? "pointer" : "default"

        // If the user is creating a line
        if (clickedPoints.length === 1) {
            console.log("Creating line")

            // Find the temp line and remove it
            const tempLine = linesRef.current.find(line => line.id === "temp")
            if (tempLine) linesRef.current = clearTempLine({ context, points: pointsRef.current, lines: linesRef.current })

            const clickedPoint = clickedPoints[0]

            const lines = drawTempLine({ from: clickedPoint, to: { x, y }, context })
            linesRef.current.push(lines)
        }
    }, [canvasRef, clickedPoints])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (canvas && context) {
            const points = drawRandomPoints({ context })
            pointsRef.current = points
        }

        return () => {
            if (context) context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        if (clickedPoints.length >= 2) {
            // Remove the temp line
            const tempLine = linesRef.current.find(line => line.id === "temp")
            if (tempLine) linesRef.current = clearTempLine({ context, points: pointsRef.current, lines: linesRef.current })

            // Check if the line already exists
            const alreadyExists = checkIfLineExists(linesRef.current, clickedPoints)

            if (alreadyExists) {
                setClickedPoints([])

                toast.error("La ligne existe déjà")

                return
            }

            const line = drawLine({ from: clickedPoints[0], to: clickedPoints[1], context })

            setClickedPoints([])
            linesRef.current.push(line)

            console.log(linesRef.current)

            toast.success("Ligne créée avec succès")
        }
    }, [clickedPoints])

    return (
        <>
            <div className="fixed right-0 top-0 m-3">
                <p>Stations : {STATIONS_NUMBER}</p>
                <p>Canvas : {CANVAS_WIDTH} x {CANVAS_HEIGHT}</p>
                <p>Nombre de lignes : {linesRef.current.length}</p>
            </div>
            <canvas
                className="bg-green-200"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
            />
            <Toaster
                position="bottom-right"
                closeButton={true}
            />
        </>
    )
}

const styles = {
    points: {
        getColor: () => "red",
        height: 10,
        width: 10
    },
    lines: {
        getColor: () => "blue",
        lineWidth: 2,
    }
}

const drawRandomPoints = ({ number = STATIONS_NUMBER, context }: { number?: number, context: CanvasRenderingContext2D }): Point[] => {
    const getPosition = () => {
        const x = Math.floor(Math.random() * (CANVAS_WIDTH - MARGIN) + MARGIN)
        const y = Math.floor(Math.random() * (CANVAS_HEIGHT - MARGIN) + MARGIN)

        return { x, y }
    }

    const points: Point[] = Array.from({ length: number }, () => {
        const { height, width, getColor } = styles.points
        const { x, y } = getPosition()
        const id = uuid()

        context.fillStyle = getColor()
        context.beginPath()
        context.rect(x, y, height, width)
        context.fill()

        return {
            x,
            y,
            id
        }
    })

    return points
}

const drawPoints = ({ context, points }: { context: CanvasRenderingContext2D, points: Point[] }) => {
    const { height, width, getColor } = styles.points
    
    points.forEach(point => {
        context.fillStyle = getColor()
        context.beginPath()
        context.rect(point.x, point.y, height, width)
        context.fill()
    })
}

const drawTempLine = ({ from, to, context }: { from: Point, to: { x: number, y: number }, context: CanvasRenderingContext2D }) => {
    const { lineWidth, getColor } = styles.lines

    context.strokeStyle = getColor()
    context.lineWidth = lineWidth

    context.beginPath()
    context.moveTo(from.x + 5, from.y + 5)
    context.lineTo(to.x, to.y)
    context.stroke()

    return {
        id: "temp",
        from,
        to: {
            id: "cursor",
            x: to.x,
            y: to.y
        } as Point
    }
}

const drawLine = ({ from, to, context }: { from: Point, to: Point, context: CanvasRenderingContext2D }): Line => {
    const { lineWidth, getColor } = styles.lines
    const id = uuid()

    context.strokeStyle = getColor()
    context.lineWidth = lineWidth

    context.beginPath()
    context.moveTo(from.x + 5, from.y + 5)
    context.lineTo(to.x + 5, to.y + 5)
    context.stroke()

    return {
        id,
        from,
        to
    }
}

const drawLines = ({ lines, context }: { lines: Line[], context: CanvasRenderingContext2D }) => {
    const { lineWidth, getColor } = styles.lines

    lines.forEach(line => {
        context.strokeStyle = getColor()
        context.lineWidth = lineWidth

        context.beginPath()
        context.moveTo(line.from.x + 5, line.from.y + 5)
        context.lineTo(line.to.x + 5, line.to.y + 5)
        context.stroke()
    })
}

const checkIfLineExists = (lines: Line[], points: Point[]) => {
    return lines.some(line => {
        const isSameFrom0 = line.from.id === points[0].id
        const isSameTo1 = line.to.id === points[1].id

        const isSameFrom1 = line.from.id === points[1].id
        const isSameTo0 = line.to.id === points[0].id

        return (isSameFrom0 && isSameTo1) || (isSameFrom1 && isSameTo0)
    })
}

const coordHasPoint = ({ event, points, canvas }: { event: MouseEvent | MouseEvent<HTMLCanvasElement>, points: Point[], canvas: HTMLCanvasElement }) => {
    const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()

    const x = event.clientX - canvasX
    const y = event.clientY - canvasY

    const hasPoint = points.find(point => {
        const { x: pointX, y: pointY } = point

        const isSameX = x >= pointX && x <= pointX + 10
        const isSameY = y >= pointY && y <= pointY + 10

        return isSameX && isSameY
    })

    return hasPoint
}

const clearTempLine = ({ context, points, lines }: { context: CanvasRenderingContext2D, points: Point[], lines: Line[] }) => {
    const tempLine = lines.find(line => line.id === "temp")
    if (tempLine) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        lines = lines.filter(line => line.id !== "temp")

        drawPoints({ points, context })
        drawLines({ lines, context })
    }

    return lines
}