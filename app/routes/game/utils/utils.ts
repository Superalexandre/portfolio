import Cookies from "universal-cookie"

import { CANVAS_HEIGHT, CANVAS_WIDTH, MARGIN, SHAPES } from "../config"

const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (CANVAS_WIDTH - MARGIN) + MARGIN)
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT - MARGIN) + MARGIN)

    return { x, y }
}

const getRandomShape = () => {
    const shapes = SHAPES
    const randomIndex = Math.floor(Math.random() * shapes.length)

    return shapes[randomIndex]
}

const changeTheme = async () => {
    const cookies = new Cookies(null, { path: "/" })
    const cookieTheme = await cookies.get("theme")

    const theme: "light" | "dark" = cookieTheme
    let newTheme: "light" | "dark" = "light"

    if (theme === "dark") {
        document.documentElement.classList.add("light")
        document.documentElement.classList.remove("dark")

        cookies.set("theme", "light")
        newTheme = "light"
    } else {
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("dark")

        cookies.set("theme", "dark")
        newTheme = "dark"
    }

    return newTheme
}

const getTheme = async () => {
    const cookies = new Cookies(null, { path: "/" })
    const cookieTheme = await cookies.get("theme")

    const theme: "light" | "dark" = cookieTheme

    return theme
}

export {
    getRandomPosition,
    getRandomShape,
    changeTheme,
    getTheme
}