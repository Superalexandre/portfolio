import { useEffect, useRef, useState } from "react"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { v4 as uuid } from "uuid"

const MARGIN = 200
const STATIONS_NUMBER = 2

const CANVAS_WIDTH = 2_000
const CANVAS_HEIGHT = 1_000

type Point = {
    x: number
    y: number
    id: string
}

export default function Index() {
    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointsRef = useRef<Point[]>([])
    const [clickedPoints, setClickedPoints] = useState<Point[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")
        
        const handleCanvasClick = (event: MouseEvent) => {
            if (!context || !canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            const clickedPoint = pointsRef.current.find(point => {
                const pointX = point.x - rect.left
                const pointY = point.y - rect.top

                const isSameX = x >= pointX && x <= pointX + 10
                const isSameY = y >= pointY && y <= pointY + 10

                console.log({
                    x, y,
                    pointX: pointX,
                    pointY: pointY,
                    isSameX,
                    isSameY,
                })

                return isSameX && isSameY
            })

            if (clickedPoint) {
                console.log("clickedPoint", clickedPoint)
                
                setClickedPoints(prev => [...prev, clickedPoint])
            }

        }

        if (canvas && context) {
            canvas.addEventListener("click", handleCanvasClick)

            const points = drawPoints({ context })
            pointsRef.current = points
        }

        return () => {
            if (canvas) canvas.removeEventListener("click", handleCanvasClick)
            if (context) context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }, [])

    return (
        <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            ref={transformComponentRef}
        >
            <TransformComponent wrapperClass="bg-green-200">
                <canvas
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    ref={canvasRef}
                    className="h-screen w-screen"
                />
            </TransformComponent>
        </TransformWrapper>
    )
}

const drawPoints = ({ number = STATIONS_NUMBER, context }: { number?: number, context: CanvasRenderingContext2D }) => {
    const getPosition = () => {
        const x = Math.floor(Math.random() * (CANVAS_WIDTH - MARGIN) + MARGIN)
        const y = Math.floor(Math.random() * (CANVAS_HEIGHT - MARGIN) + MARGIN)

        return { x, y }
    }

    const points = Array.from({ length: number }, () => {
        const { x, y } = getPosition()
        const id = uuid()

        context.fillStyle = "red"
        context.beginPath()
        // context.arc(x, y, 10, 0, 2 * Math.PI)
        context.rect(x, y, 10, 10)
        context.fill()

        return { x, y, id }
    })

    return points
}

const drawLines = ({ points, context, }: { points: { x: number; y: number; id: string }[], context: CanvasRenderingContext2D }) => {
    context.strokeStyle = "blue"
    context.lineWidth = 2

    points.forEach((point, index) => {
        const nextPoint = points[index + 1]

        if (nextPoint) {
            context.beginPath()
            context.moveTo(point.x + 5, point.y + 5)
            context.lineTo(nextPoint.x + 5, nextPoint.y + 5)
            context.stroke()
        }
    })
}

/*
const positionFromStyle = (style: string) => {
    const regex = /translate\(([-+]?\d*\.?\d+)px,\s*([-+]?\d*\.?\d+)px\)\s*scale\(([-+]?\d*\.?\d+)\)/gm

    const match = regex.exec(style)

    if (match) {
        const [, x, y, scale] = match
        
        return { x: +x, y: +y, scale: +scale }
    }

    return { x: 0, y: 0, scale: 1 }
}
*/ 