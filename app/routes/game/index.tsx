import { useEffect, useRef } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { v4 as uuid } from "uuid"

const MARGIN = 200

export default function Index() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointsRef = useRef<{ x: number; y: number; id: string }[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")

        const handleCanvasClick = (event: MouseEvent) => {
            console.log("click")

            const { offsetX, offsetY } = event
            const clickedPoint = pointsRef.current.find((point) => {
                offsetX >= point.x &&
                offsetX <= point.x + 10 &&
                offsetY >= point.y &&
                offsetY <= point.y + 10
            })

            if (context && clickedPoint) {
                pointsRef.current.push(clickedPoint)
                drawLines({ points: pointsRef.current, context })
            }
        }

        if (canvas && context) {
            canvas.addEventListener("click", handleCanvasClick)

            drawPoints({ context })
        }

        return () => {
            canvas?.removeEventListener("click", handleCanvasClick)
        }
    }, [])

    return (
        <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
        >
            <TransformComponent wrapperClass="bg-green-200">
                <canvas
                    width={2_000}
                    height={1_000}
                    ref={canvasRef}
                    className="h-screen w-screen"
                />
            </TransformComponent>
        </TransformWrapper>
    )
}

const drawPoints = ({ number = 10, context }: { number?: number, context: CanvasRenderingContext2D }) => {
    const getPosition = () => {
        const x = Math.floor(Math.random() * (context.canvas.width - MARGIN))
        const y = Math.floor(Math.random() * (context.canvas.height - MARGIN))

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

        return {
            x,
            y,
            id
        }
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
