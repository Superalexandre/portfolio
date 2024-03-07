interface Params {
    x: number,
    y: number,
    width: number,
    height: number,
    context: CanvasRenderingContext2D
    color?: string
}

interface StarParams extends Params {
    branches: number
}

const circle = ({ x, y, width, context, color = "purple" }: Params) => {
    context.beginPath()
    context.fillStyle = color

    const radius = width / 2
    context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)

    context.closePath()
    context.fill()
}

const square = ({ x, y, width, height, context, color = "green" }: Params) => {
    context.beginPath()
    context.fillStyle = color

    context.rect(x, y, width, height)

    context.closePath()
    context.fill()
}

const triangle = ({ x, y, width, height, context, color = "blue" }: Params) => {
    context.beginPath()
    context.fillStyle = color

    const topX = x + width / 2
    const topY = y
    const bottomLeftX = x
    const bottomLeftY = y + height
    const bottomRightX = x + width
    const bottomRightY = y + height

    context.moveTo(topX, topY)
    context.lineTo(bottomRightX, bottomRightY)
    context.lineTo(bottomLeftX, bottomLeftY)

    context.closePath()
    context.fill()
}

const star = ({ x, y, width, height, context, branches = 5, color = "yellow" }: StarParams) => {
    context.beginPath()
    context.fillStyle = color

    const angleStep = (Math.PI * 2) / branches
    const innerRadius = width / 4

    for (let i = 0; i < branches * 2; i++) {
        const radius = i % 2 === 0 ? width / 2 : innerRadius
        const angle = i * angleStep - Math.PI / 2
        const xPos = (x + radius * Math.cos(angle)) + width / 2
        const yPos = (y + radius * Math.sin(angle)) + height / 2

        if (i === 0) {
            context.moveTo(xPos, yPos)
        } else {
            context.lineTo(xPos, yPos)
        }
    }

    context.closePath()
    context.fill()
}

export {
    circle,
    square,
    triangle,
    star
}