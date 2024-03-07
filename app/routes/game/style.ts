const purple = "#C8A2C8"
const pink = "#FFC0CB"
const red = "#EE4266"
const orange = "#F8B878"
const brown = "#D0A68C"
const yellow = "#F0E68C"
const green = "#98FB98"
const blue = "#87CEEB"


type LineColor = typeof purple | typeof pink | typeof red | typeof orange | typeof brown | typeof yellow | typeof green | typeof blue | string

interface Colors {
    purple: string
    pink: string
    red: string
    orange: string
    brown: string
    yellow: string
    green: string
    blue: string

    [key: string]: string
}
const colors: Colors = {
    purple,
    pink,
    red,
    orange,
    brown,
    yellow,
    green,
    blue
}

const styles = {
    stations: {
        getColor: () => "#51576B",
        height: 30,
        width: 30
    },
    lines: {
        getColor: (isTemp = false) => {
            if (isTemp) return "#BCBCBC"

            const colorKeys = Object.keys(colors)
            const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)]

            return colors[randomColor]
        },
        lineWidth: 2,
    },
    colors: colors
}

export default styles
export {
    styles,
    colors
}

export type {
    LineColor
}