import { useEffect, useRef, useState } from "react"
// import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { MdSettings } from "react-icons/md"
import { Toaster, toast } from "sonner"

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config"
import { handleCanvasClick } from "./events/handleCanvasClick"
import { handleContextMenu } from "./events/handleContextMenu"
import { handleMouseMove } from "./events/handleMouseMove"
import styles from "./style"
import LineSelector from "./ui/LineSelector"
import SettingsModal from "./ui/SettingsModal"
import SpeedSelector from "./ui/SpeedSelector"
import { Line, checkIfLineExists, clearTempLine, drawLine, drawLines, reverseFromTo } from "./utils/line"
import { getTrainPath } from "./utils/path"
import { Station, drawRandomStations, drawStations, highlightedStations, removeHighlightedStations } from "./utils/station"
import { Train, canConnect, genTrain, handleTrain } from "./utils/train"
import { getTheme } from "./utils/utils"

export default function Index() {
    const mainLayer = useRef<HTMLCanvasElement>(null)
    const trainLayer = useRef<HTMLCanvasElement>(null)

    const stationsRef = useRef<Station[]>([])
    const linesRef = useRef<Line[]>([])
    const trainsRef = useRef<Train[]>([])

    const intervalRef = useRef<NodeJS.Timeout>()

    const [clickedStations, setClickedStations] = useState<Station[]>([])
    const [speed, setSpeed] = useState(3)
    const [settingsHidden, setSettingsHidden] = useState(true)

    const [color, setColor] = useState(styles.colors.purple)
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const ms = speed === 0 ? 0 : 1000 / (60 * speed)
    const realLines = linesRef.current.filter(line => line.id !== "temp")

    const smallScreen = false

    useEffect(() => {
        // console.log("useEffect empty")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        getTheme().then(themeValue => setTheme(() => themeValue))

        if (canvas && context) {
            const stations = drawRandomStations({ context })
            stationsRef.current = stations
        }

        return () => {
            if (context) context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        }
    }, [])

    useEffect(() => {
        // console.log("useEffect clickedStations")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        if (!context || !canvas) return

        if (clickedStations.length >= 2) {
            stationsRef.current = removeHighlightedStations(stationsRef.current)

            // Remove the temp line
            const tempLine = linesRef.current.find(line => line.id === "temp")
            if (tempLine) linesRef.current = clearTempLine({ context, stations: stationsRef.current, lines: linesRef.current })


            // Check if the line already exists
            const alreadyExists = checkIfLineExists(linesRef.current, clickedStations, color)

            if (alreadyExists) {
                setClickedStations([])

                toast.error("La ligne existe déjà")

                return
            }

            const lineColorHaveTrain = trainsRef.current.some(train => train.lines.some(line => line.color === color))
            const canConnectToOtherTrain = canConnect({
                trains: trainsRef.current, line: {
                    id: "temp",
                    from: clickedStations[0],
                    to: clickedStations[1],
                    color
                }
            })

            if (lineColorHaveTrain && canConnectToOtherTrain.length === 0) {
                toast.error("Votre ligne doit être connectée à une autre ligne existante pour créer un train.")

                setClickedStations([])

                return
            }

            const [from, to] = clickedStations
            const line = drawLine({ from, to, context, color })

            setClickedStations([clickedStations[1]])

            stationsRef.current = highlightedStations(stationsRef.current, clickedStations[1])
            linesRef.current.push(line)

            toast.success("Ligne créée avec succès")
        } else {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height)

            drawStations({ stations: stationsRef.current, context })
            drawLines({ lines: linesRef.current, context })
        }
    }, [clickedStations])

    useEffect(() => {
        // console.log("useEffect realLines")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        const trainCanvas = trainLayer.current
        const trainContext = trainCanvas?.getContext("2d")

        if (!context || !canvas || !trainCanvas || !trainContext) return

        if (realLines.length > 0) {
            // Check if the new line is the same color as the previous one and if its the same stations
            const lastLine = realLines[realLines.length - 1]

            const canConnectToOtherTrain = canConnect({ trains: trainsRef.current, line: lastLine })

            if (canConnectToOtherTrain.length > 0) {
                if (canConnectToOtherTrain.length > 1) return console.error("!! More than one train can connect to the line !!")

                const canConnectResult = canConnectToOtherTrain[0]
                if (!canConnectResult.canConnect) return

                console.log("Can connect to another train")

                const { train, isStart } = canConnectResult

                if (isStart) {
                    console.log("Is start")

                    const reversedLastLine = reverseFromTo(lastLine)

                    const lastOrder = train.lines.length > 0 ? train.lines[0].order : 0
                    const newOrder = lastOrder - 1

                    train.lines.splice(0, 0, {
                        ...reversedLastLine,
                        order: newOrder,
                    })

                } else {
                    console.log("Is end", canConnectResult.isEnd)

                    const order = train.lines.filter(line => line.order < 0).length + 1

                    train.lines.push({
                        ...lastLine,
                        order: order,
                    })
                }

                // Update the path
                train.path = getTrainPath({ train })

                trainsRef.current[trainsRef.current.indexOf(train)] = train
            } else {
                // Check if the lastLine is already in a train
                const lineInTrain = trainsRef.current.some(train => train.lines.some(line => line.id === lastLine.id))
                if (lineInTrain) return

                const newTrain = genTrain({
                    lines: [{
                        ...lastLine,
                        order: 0,
                    }]
                })

                trainsRef.current.push(newTrain)
            }
        }
    }, [realLines.length])

    useEffect(() => {
        // console.log("useEffect trainsRef and ms")

        const trainCanvas = trainLayer.current
        const trainContext = trainCanvas?.getContext("2d")

        if (!trainCanvas || !trainContext) return

        if (trainsRef.current.length === 0) return
        if (intervalRef.current) clearInterval(intervalRef.current)

        if (ms === 0) return

        const { interval } = handleTrain({ trains: trainsRef, context: trainContext, ms })
        intervalRef.current = interval

        return () => {
            clearInterval(intervalRef.current)
        }

    }, [realLines.length, trainsRef.current.length, ms])

    const handleDownload = () => {
        const json = JSON.stringify({
            canvas: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
            },
            speed,
            theme,
            buildingStations: clickedStations,
            interval: intervalRef.current,
            stations: stationsRef.current,
            lines: linesRef.current,
            trains: trainsRef.current,
        }, null, 4)

        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "metro.json"
        a.click()
        a.remove()
    }

    return (
        <>
            <SettingsModal
                hidden={settingsHidden}
                setHidden={() => {
                    setSettingsHidden(!settingsHidden)
                }}
                theme={theme}
                setTheme={setTheme}
                handleDownload={handleDownload}
                data={{
                    stations: stationsRef.current,
                    lines: linesRef.current,
                    trains: trainsRef.current,
                }}
            />
            <div className="fixed left-0 top-0 z-30 m-3">
                <LineSelector color={color} setColor={setColor} />
            </div>
            <div className="fixed right-0 top-0 z-30 m-3 flex flex-row items-center justify-center gap-8">
                <SpeedSelector speed={speed} setSpeed={setSpeed} />

                <MdSettings size={30} className="cursor-pointer text-black dark:text-white" onClick={() => setSettingsHidden(!settingsHidden)} />
            </div>
            <canvas
                className="bg-[#EBEBEB] dark:bg-[#070F2B]"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                ref={mainLayer}
                onClick={(event) => handleCanvasClick({ event, mainLayer, stationsRef, linesRef, trainsRef, clickedStations, setClickedStations })}
                onContextMenu={(event) => handleContextMenu({ event, mainLayer, linesRef, stationsRef, setClickedStations })}
                onMouseMove={(event) => handleMouseMove({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations, smallScreen })}
            />

            <canvas
                className="absolute left-0 top-0 z-10 bg-transparent"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                ref={trainLayer}
                onClick={(event) => handleCanvasClick({ event, mainLayer, stationsRef, linesRef, trainsRef, clickedStations, setClickedStations })}
                onContextMenu={(event) => handleContextMenu({ event, mainLayer, linesRef, stationsRef, setClickedStations })}
                onMouseMove={(event) => handleMouseMove({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations, smallScreen })}
            />
            <Toaster
                position="bottom-right"
                closeButton={true}
            />
        </>
    )
}