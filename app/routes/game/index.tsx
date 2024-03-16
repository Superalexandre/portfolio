import { useEffect, useRef, useState } from "react"
// import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { MdCheck, MdClose, MdFastForward, MdForward10, MdForward30, MdForward5, MdPause, MdSettings } from "react-icons/md"
import { Toaster, toast } from "sonner"

import { CANVAS_HEIGHT, CANVAS_WIDTH, STATIONS_NUMBER } from "./config"
import { handleCanvasClick } from "./events/handleCanvasClick"
import { handleContextMenu } from "./events/handleContextMenu"
import { handleMouseMove } from "./events/handleMouseMove"
import styles from "./style"
import { Line, checkIfLineExists, clearTempLine, drawLine, drawLines } from "./utils/line"
import { getTrainPath, reverseFromTo } from "./utils/path"
import { Station, drawRandomStations, drawStations, highlightedStations, removeHighlightedStations } from "./utils/station"
import { Train, canConnect, genTrain, handleTrain } from "./utils/train"
import { changeTheme, getTheme } from "./utils/utils"

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

interface SettingsModalProps {
    hidden: boolean
    setHidden: () => void

    theme: "light" | "dark"
    setTheme: (theme: "light" | "dark") => void

    handleDownload: () => void

    data: {
        stations: Station[]
        lines: Line[]
        trains: Train[]
    }
}

const SettingsModal = ({ hidden, setHidden, theme, setTheme, handleDownload, data }: SettingsModalProps) => {
    return (
        <div className={`${hidden ? "hidden" : "block"} fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80`}>
            <div className="relative z-50 m-8 flex flex-col items-center justify-center gap-8 rounded-md bg-slate-400 p-8 dark:bg-slate-700 lg:m-0">
                <button
                    onClick={setHidden}
                    className="absolute right-0 top-0 m-4 hover:text-white dark:text-white dark:hover:text-black"
                >
                    <MdClose size={16} />
                </button>

                <ThemeSelector
                    theme={theme}
                    setTheme={setTheme}
                />

                <div className="flex flex-col items-center justify-center">
                    <p className="text-center dark:text-white">Data :</p>
                    <p className="text-center dark:text-white">Stations : {STATIONS_NUMBER}</p>
                    <p className="text-center dark:text-white">Canvas : {CANVAS_WIDTH} x {CANVAS_HEIGHT}</p>
                    <p className="text-center dark:text-white">Nombre de lignes : {data.lines.length}</p>
                    <p className="text-center dark:text-white">Nombre de trains : {data.trains.length}</p>
                </div>

                <button
                    onClick={handleDownload}
                    className="text-center hover:underline dark:text-white"
                >
                    Télécharger les données
                </button>
            </div>
        </div>
    )
}

interface ThemeSelectorProps {
    theme: "light" | "dark"
    setTheme: (theme: "light" | "dark") => void
}

const ThemeSelector = ({ theme, setTheme }: ThemeSelectorProps) => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <input
                type="checkbox"
                id="theme"
                name="theme"
                checked={theme === "dark"}
                onChange={async () => {
                    const newTheme = await changeTheme()

                    setTheme(newTheme)
                }}
            />
            <label htmlFor="theme" className="dark:text-white">Thème sombre</label>
        </div>
    )
}

interface SpeedSelectorProps {
    speed: number
    setSpeed: (speed: number) => void
}

const SpeedSelector = ({ speed, setSpeed }: SpeedSelectorProps) => {
    const speeds = [{
        value: 0,
        icon: MdPause
    }, {
        value: 0.5,
        icon: MdForward5
    }, {
        value: 1,
        icon: MdForward10
    }, {
        value: 1.5,
        icon: MdForward30
    }, {
        value: 3,
        icon: MdFastForward
    }]

    return (
        <div className="flex flex-row items-center justify-start gap-2">

            {speeds.map((speedValue, index) => (
                <button
                    key={index}
                    onClick={() => setSpeed(speedValue.value)}
                    className={`flex items-center justify-center ${speed === speedValue.value ? "text-green-500" : "text-black dark:text-white"}`}
                >
                    <speedValue.icon size={30} />
                </button>
            ))}
        </div>
    )

}

interface LineSelectorProps {
    color: string
    setColor: (color: string) => void
}

const LineSelector = ({ color, setColor }: LineSelectorProps) => {
    const colorLines = Object.values(styles.colors)

    return (
        <div className="flex flex-row items-center gap-2">
            <p className="dark:text-white">Lignes :</p>
            {colorLines.map((colorLine, index) => (
                <button
                    key={index} className={`bg-[${colorLine}] flex h-6 w-6 items-center justify-center rounded-full`}
                    onClick={() => setColor(colorLine)}
                >
                    {color === colorLine ? <MdCheck className="text-dark" /> : null}

                    <span className="sr-only">{colorLine}</span>
                </button>
            ))}
        </div>
    )
}