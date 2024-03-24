import { useSpring, animated } from "@react-spring/web"
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useGesture } from "@use-gesture/react"
import { useEffect, useRef, useState } from "react"
import { MdSettings } from "react-icons/md"
import { Toaster, toast } from "sonner"

import Loader from "~/Components/Loader"
import { getUser } from "~/session.server"

import { handleCanvasClick } from "../events/handleCanvasClick"
import { handleContextMenu } from "../events/handleContextMenu"
import { handleMouseMove } from "../events/handleMouseMove"
import styles from "../style"
import LineSelector from "../ui/LineSelector"
import SettingsModal from "../ui/SettingsModal"
import SpeedSelector from "../ui/SpeedSelector"
import { PendingRequest, saveDatabase } from "../utils/database"
import { getGameById, serverSaveDatabase } from "../utils/game"
import { Line, checkIfLineExists, clearTempLine, drawLine, drawLines, reverseFromTo } from "../utils/line"
import { getTrainPath } from "../utils/path"
import { Station, drawStations, highlightedStations, removeHighlightedStations } from "../utils/station"
import { Train, canConnect, genTrain, handleTrain, retrieveTrains } from "../utils/train"
import { getTheme } from "../utils/utils"

export async function action({ request }: ActionFunctionArgs) {
    const user = await getUser(request)
    if (!user) return redirect("/game")

    // get the body data
    const jsonData = await request.json()

    await serverSaveDatabase(jsonData)

    // Wait 10s before returning
    // await new Promise(resolve => setTimeout(resolve, 10000))

    return json({
        success: true,
        error: false,
        message: "ok"
    })
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    if (!params.id) return redirect("/game")

    const user = await getUser(request)
    if (!user) return redirect("/game")

    const game = await getGameById(params.id, user)
    if (!game) return redirect("/game")

    return { game }
}

export default function Game() {
    const { game } = useLoaderData<typeof loader>()
    
    const canvasWidth = game.canvasWidth
    const canvasHeight = game.canvasHeight

    const mainLayer = useRef<HTMLCanvasElement>(null)
    const trainLayer = useRef<HTMLCanvasElement>(null)

    const stationsRef = useRef<Station[]>(game.stations)
    const linesRef = useRef<Line[]>(game.lines)
    const trainsRef = useRef<Train[]>([])

    const pendingRequests = useRef<PendingRequest[]>([])
    const [loadingReq, setLoadingReq] = useState(true)

    const intervalRef = useRef<NodeJS.Timeout>()

    const [clickedStations, setClickedStations] = useState<Station[]>([])
    const [speed, setSpeed] = useState(3)
    const [settingsHidden, setSettingsHidden] = useState(true)

    const [color, setColor] = useState(styles.colors.purple)
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const ms = speed === 0 ? 0 : 1000 / (60 * speed)
    const realLines = linesRef.current.filter(line => line.id !== "temp")

    const smallScreen = false

    const scale = useRef(1)
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0, immediate: true }))

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)


    useEffect(() => {
        // console.log("useEffect empty")

        const canvas = mainLayer.current
        const context = canvas?.getContext("2d")

        getTheme().then(themeValue => setTheme(() => themeValue))

        if (canvas && context) {
            // Draw a border around the canvas
            context.strokeStyle = "red"
            context.lineWidth = 2
            context.strokeRect(0, 0, canvasWidth, canvasHeight)

            // const stations = drawRandomStations({ context })
            // const stations = drawSeedStations({ seed: "coucou", context }) 
            // stationsRef.current = stations
            drawStations({ stations: stationsRef.current, context })
            drawLines({ stations: stationsRef.current, lines: linesRef.current, context })

            trainsRef.current = retrieveTrains({ stations: stationsRef.current, lines: linesRef.current })
        }

        if (window) {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }

        setLoadingReq(false)

        return () => {
            if (context) context.clearRect(0, 0, canvasWidth, canvasHeight)

            if (intervalRef.current) clearInterval(intervalRef.current)
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
            const alreadyExists = checkIfLineExists(stationsRef.current, linesRef.current, clickedStations, color)

            if (alreadyExists) {
                setClickedStations([])

                toast.error("La ligne existe déjà")

                return
            }

            const lineColorHaveTrain = trainsRef.current.some(train => train.lines.some(line => line.color === color))
            const canConnectToOtherTrain = canConnect({
                stations: stationsRef.current,
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
            const line = drawLine({ stations: stationsRef.current, from, to, gameId: game.id, context, color })
            const req = saveDatabase({ type: "line", action: "create", gameId: game.id, data: line, id: line.id })
            pendingRequests.current.push(req)

            setClickedStations([clickedStations[1]])

            stationsRef.current = highlightedStations(stationsRef.current, clickedStations[1])
            linesRef.current.push(line)

            toast.success("Ligne créée avec succès")
        } else {
            context.clearRect(0, 0, canvasWidth, canvasHeight)

            drawStations({ stations: stationsRef.current, context })
            drawLines({ stations: stationsRef.current, lines: linesRef.current, context })
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

            const canConnectToOtherTrain = canConnect({ stations: stationsRef.current, trains: trainsRef.current, line: lastLine })

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
                train.path = getTrainPath({ stations: stationsRef.current, train })

                trainsRef.current[trainsRef.current.indexOf(train)] = train
            } else {
                // Check if the lastLine is already in a train
                const lineInTrain = trainsRef.current.some(train => train.lines.some(line => line.id === lastLine.id))
                if (lineInTrain) return

                const newTrain = genTrain({
                    stations: stationsRef.current,
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

        const { interval } = handleTrain({ stations: stationsRef.current, trains: trainsRef, context: trainContext, ms })
        intervalRef.current = interval

        return () => {
            clearInterval(intervalRef.current)
        }

    }, [realLines.length, trainsRef.current.length, ms])

    useEffect(() => {
        console.log("useEffect request")

        if (pendingRequests.current.length === 0) return setLoadingReq(false)

        setLoadingReq(true)

        pendingRequests.current.forEach(({ request, requestId }) => {
            request.then(() => {
                pendingRequests.current = pendingRequests.current.filter(req => req.requestId !== requestId)

                if (pendingRequests.current.length === 0) setLoadingReq(false)
            })
        })

    }, [pendingRequests.current.length, loadingReq])

    const handleDownload = () => {
        const jsonDownload = JSON.stringify({
            canvas: {
                width: canvasWidth,
                height: canvasHeight,
            },
            scale: scale.current,
            position: {
                x: x.get(),
                y: y.get(),
            },
            speed,
            theme,
            buildingStations: clickedStations,
            interval: intervalRef.current,
            stations: stationsRef.current,
            lines: linesRef.current,
            trains: trainsRef.current,
        }, null, 4)

        const blob = new Blob([jsonDownload], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "metro.json"
        a.click()
        a.remove()
    }

    const bind = useGesture({
        onWheel: ({ delta: [, dy] }) => {
            const minScale = 0.4
            const maxScale = 1.5

            const zoomFactor = smallScreen ? 0.01 : 0.009

            const nextZoomOut = scale.current * (1 + zoomFactor)
            const nextZoom = scale.current * (1 - zoomFactor)

            if (dy < 0 && minScale < nextZoomOut && nextZoomOut < maxScale) {
                // Dézoomer
                scale.current = Math.max(minScale, scale.current * (1 + zoomFactor))
            } else if (dy > 0 && minScale < nextZoom && nextZoom < maxScale) {
                // Zoomer
                scale.current = Math.min(maxScale, scale.current * (1 - zoomFactor))
            }

            if (mainLayer.current) mainLayer.current.style.transform = `scale(${scale.current}) translate(${x.get()}px, ${y.get()}px)`
            if (trainLayer.current) trainLayer.current.style.transform = `scale(${scale.current}) translate(${x.get()}px, ${y.get()}px)`
        },
        onDrag: ({ offset: [ox, oy] }) => {
            api.set({ x: ox, y: oy })

            if (mainLayer.current) mainLayer.current.style.transform = `scale(${scale.current}) translate(${x.get()}px, ${y.get()}px)`
            if (trainLayer.current) trainLayer.current.style.transform = `scale(${scale.current}) translate(${x.get()}px, ${y.get()}px)`
        },
    }, {
        drag: {
            from: () => [x.get(), y.get()],
            bounds: {
                left: -canvasWidth * scale.current + width,
                right: 0,
                top: -canvasHeight * scale.current + height,
                bottom: 0,
            }
        },
    })

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
                    smallScreen,
                    stations: stationsRef.current,
                    lines: linesRef.current,
                    trains: trainsRef.current,
                }}
                canvas={{
                    width: canvasWidth,
                    height: canvasHeight,
                }}
            />
            <div className="fixed left-0 top-0 z-30 m-3">
                <LineSelector color={color} setColor={setColor} />
            </div>
            <div className="fixed right-0 top-0 z-30 m-3 flex flex-row items-center justify-center gap-8">
                <SpeedSelector speed={speed} setSpeed={setSpeed} />

                <MdSettings size={30} className="cursor-pointer text-black dark:text-white" onClick={() => setSettingsHidden(!settingsHidden)} />
            </div>
            <div {...bind()} className="absolute h-screen w-screen touch-none overflow-hidden">
                <animated.canvas
                    className="overflow-hidden bg-[#EBEBEB] dark:bg-[#070F2B]"
                    width={canvasWidth}
                    height={canvasHeight}
                    ref={mainLayer}
                    onClick={(event) => handleCanvasClick({ event, mainLayer, stationsRef, linesRef, trainsRef, clickedStations, setClickedStations, scale: scale.current, pendingRequests })}
                    onContextMenu={(event) => handleContextMenu({ event, mainLayer, linesRef, stationsRef, setClickedStations })}
                    onMouseMove={(event) => handleMouseMove({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations, smallScreen, scale: scale.current })}

                    style={{
                        transform: `translate(${x.get()}, ${y.get()}) scale(${scale.current})`,
                    }}
                />

                <animated.canvas
                    className="absolute left-0 top-0 z-10 bg-transparent"
                    width={canvasWidth}
                    height={canvasHeight}
                    ref={trainLayer}
                    onClick={(event) => handleCanvasClick({ event, mainLayer, stationsRef, linesRef, trainsRef, clickedStations, setClickedStations, scale: scale.current, pendingRequests })}
                    onContextMenu={(event) => handleContextMenu({ event, mainLayer, linesRef, stationsRef, setClickedStations })}
                    onMouseMove={(event) => handleMouseMove({ event, mainLayer, trainLayer, stationsRef, linesRef, clickedStations, smallScreen, scale: scale.current })}

                    style={{
                        transform: `translate(${x.get()}, ${y.get()}) scale(${scale.current})`,
                    }}
                />
            </div>

            <Loader className={`${loadingReq ? "block" : "hidden"} fixed bottom-0 right-0 m-4 size-5`}></Loader>

            <Toaster
                position="bottom-right"
                closeButton={true}
            />
        </>
    )
}