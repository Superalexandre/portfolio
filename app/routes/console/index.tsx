import { useKeyboardEvent, useLocalStorageValue } from "@react-hookz/web"
import { MetaFunction } from "@remix-run/node"
import { useNavigate } from "@remix-run/react"
import { TFunction, i18n as i18nType } from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"


import information from "@/informations/informations"
import schools from "@/informations/schools"
import useChangeLanguage from "~/hooks/useChangeLanguage"

export const meta: MetaFunction = () => {
    return [
        { title: "Mode Console - Alexandre Renard" },
        { name: "description", content: "Portfolio d'Alexandre Renard" },
    ]
}

type History = Array<string | string[]>
interface Colors {
    [key: string]: string
}

export default function Index() {
    const cachedLanguage = useLocalStorageValue("language")
    const navigate = useNavigate()

    const { t, i18n } = useTranslation("common", { useSuspense: true })
    const [language, setLanguage] = useState(cachedLanguage.value as string || i18n.language)
    useChangeLanguage(language)

    const birthDate = information.birthDate
    const dateNow = new Date()

    // Set the version of the console (the date of birth of the author of the portfolio)
    const version = `${birthDate.getFullYear()}.${birthDate.getMonth() + 1}.${birthDate.getDate()}-${dateNow.getFullYear() - birthDate.getFullYear()}`

    const allRightsReserved = t("console.allRightsReserved")
    const [history, setHistory] = useState<History>([[`Alexandre OS [version ${version}]`, allRightsReserved]])
    const [historyCommand, setHistoryCommand] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState<number>(0)
    const [command, setCommand] = useState<string>("")
    const [path,] = useState<string>("C:\\Users\\Alexandre>")
    const [color, setColor] = useState<string>("white")

    const resetCommand = () => {
        setCommand("")
        setHistoryIndex(0)
    }

    const colors: Colors = {
        "white": "text-white",
        "green": "text-green-500",
        "red": "text-red-500",
        "blue": "text-blue-500",
        "yellow": "text-yellow-500",
        "orange": "text-orange-500",
        "pink": "text-pink-500",
        "purple": "text-purple-500",
        "lime": "text-lime-500",
    }

    useKeyboardEvent(true, async(e) => {
        const validRegex = /^[a-zA-Z0-9 _-]$|^Enter$|^Backspace$|^ArrowUp$|^ArrowDown$/

        if (!validRegex.test(e.key)) return
        // if (["Control", "Alt", "Shift", "Escape", "ArrowRight", "Tab", "ArrowLeft"].includes(e.key)) return


        if (e.key === "Backspace") return setCommand((prev) => prev.slice(0, -1))
        // if (e.key === "Tab") return setCommand((prev) => prev ? prev + "    " : "    ")

        if (e.key === "ArrowUp") {
            if (historyCommand.length === 0) return
            if ((historyIndex + 1) > historyCommand.length) return


            setHistoryIndex((prev) => prev + 1)
            console.log("up", historyCommand.length - historyIndex, historyCommand.length, historyIndex, historyCommand)

            const lastCommand = historyCommand[historyCommand.length - (historyIndex + 1)]
            setCommand(lastCommand)

            return
        }

        if (e.key === "ArrowDown") {
            if (historyCommand.length === 0) return
            if (historyIndex === 0) return

            setHistoryIndex((prev) => prev - 1)
            console.log("down", historyCommand.length - historyIndex, historyCommand.length, historyIndex, historyCommand)

            const lastCommand = historyCommand[historyCommand.length - (historyIndex - 1)]
            setCommand(lastCommand || "")

            return
        }

        if (e.key === "Enter") {
            const [cmd, ...args] = command.split(" ")
            const lastCommand = "C:\\Users\\Alexandre>" + command

            if (!cmd) {
                setHistory((prev: History) => [...prev, path])

                return
            }

            // Special commands
            if (["cls", "clear"].includes(command)) {
                setHistory([[`Alexandre OS [version ${version}]`, allRightsReserved]])
                setHistoryCommand((prev) => [...prev, command])
                resetCommand()

                return
            }

            if (["exit", "quit", "home"].includes(command)) {
                return navigate("/")
            }

            const resultCommand = await handleCommand(cmd, t, i18n, setLanguage, setColor, colors, ...args)

            setHistory((prev: History) => [...prev, [lastCommand, ...resultCommand]])
            setHistoryCommand((prev) => [...prev, command])
            resetCommand()

            return
        }

        setCommand((prev) => prev + e.key)
    })

    return (
        <div className="bg-black min-w-full h-full min-h-screen flex flex-col gap-4 p-3">

            <div className="flex flex-col gap-4">
                {history.map((line, i) => (
                    Array.isArray(line) ? (
                        <div key={i}>
                            {line.map((l, j) => <p key={j} className={`${colors[color]} break-all`}>{l}</p>)}
                        </div>
                    )
                        : (
                            <p key={i} className={`${colors[color]} break-all`}>{line}</p>
                        )
                ))}
            </div>

            <p className={`${colors[color]} break-all`}>{path}{command}</p>
        </div>
    )
}

interface Command {
    [key: string]: CommandProps
}

type CommandResult = string[] | Promise<string[]>
interface CommandProps {
    name: string
    description: string[]
    usage: string[],
    alias: string[],
    run: (...args: string[]) => CommandResult
}

const handleCommand = (command: string, t: TFunction<"common", undefined>, i18n: i18nType, setLanguage: (locale: string) => void, setColor: (color: string) => void, colors: Colors, ...args: string[]): CommandResult => {
    const commands: Command = {
        help: {
            name: "help",
            description: [t("console.commands.help.description")],
            usage: [t("console.commands.help.usage")],
            alias: ["h"],
            run: (cmd) => {
                if (!cmd) return Object.keys(commands)

                // Check if the command exists or if it's an alias
                const cmdAlias = Object.keys(commands).find((c) => commands[c].alias.includes(cmd))
                if (!commands[cmd] && !cmdAlias) return [t("console.commands.error.commandNotFound", { command: cmd })]

                const { name, description, usage, alias } = commands[cmd] || commands[cmdAlias as string]

                return [
                    `${t("console.command")}: ${name}`,
                    `${t("console.description")}: ${description.join(" ")}`,
                    `${t("console.usage")}: ${usage.join(" ")}`,
                    `${t("console.aliases")}: ${alias.length > 0 ? alias.join(", ") : t("console.none")}`,
                ]
            },
        },
        setLanguage: {
            name: "setLanguage",
            description: [t("console.commands.setLanguage.description")],
            usage: [t("console.commands.setLanguage.usage")],
            alias: ["sl"],
            run: async(language) => {
                const supportedLngs = i18n.options.supportedLngs as string[]
                const availableLanguages = supportedLngs.filter((lng) => lng !== "cimode")

                if (!language) return [t("console.commands.setLanguage.missingArgument", { languages: availableLanguages.join(", ") })]
                if (!availableLanguages.includes(language)) return [t("console.commands.setLanguage.invalidArgument", { language })]

                setLanguage(language)
                await i18n.changeLanguage(language) // ! Force the change of the language

                return [t("console.commands.setLanguage.success", { language })]
            },
        },
        clear: {
            name: "clear",
            description: [t("console.commands.clear.description")],
            usage: [t("console.commands.clear.usage")],
            alias: ["cls"],
            run: () => {
                return []
            },
        },
        exit: {
            name: "exit",
            description: [t("console.commands.exit.description")],
            usage: [t("console.commands.exit.usage")],
            alias: ["quit", "home"],
            run: () => {
                return []
            },
        },
        schools: {
            name: "schools",
            description: [t("console.commands.schools.description")],
            usage: [t("console.commands.schools.usage")],
            alias: ["school"],
            run: () => {
                return schools.map((school) => `[${school.startDate} -> ${school.endDate}] ${school.name} (${school.code})`)
            },
        },
        color: {
            name: "color",
            description: [t("console.commands.color.description")],
            usage: [t("console.commands.color.usage")],
            alias: ["colors"],
            run: (color) => {
                if (!color) return [t("console.commands.color.missingArgument", { colors: Object.keys(colors).join(", ") })]
                if (!Object.keys(colors).includes(color)) return [t("console.commands.color.invalidArgument", { color })]

                setColor(color)

                return []
            },
        },
    }

    if (commands[command]) return commands[command].run(...args)

    // Check if the command exists or if it's an alias
    const cmdAlias = Object.keys(commands).find((c) => commands[c].alias.includes(command))
    if (cmdAlias) return commands[cmdAlias].run(...args)

    return [t("console.commands.error.commandNotFound", { command })]
}