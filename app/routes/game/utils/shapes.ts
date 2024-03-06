interface Params {
    x: number,
    y: number,
    width: number,
    height: number,
    context: CanvasRenderingContext2D
}

const circle = ({ x, y, width, context }: Params) => {
    context.beginPath()
    context.arc(x, y, width, 0, 2 * Math.PI)
    context.fill()
}

const square = ({ x, y, width, height, context }: Params) => {
    context.beginPath()
    context.rect(x, y, width, height)
    context.fill()
}

const triangle = ({ x, y, width, height, context }: Params) => {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + width, y)
    context.lineTo(x + width / 2, y - height)
    context.fill()
}

const star = ({ x, y, width, height, context }: Params) => {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + width, y)
    context.lineTo(x + width / 2, y - height)
    context.lineTo(x, y)
    context.fill()
}

export {
    circle,
    square,
    triangle,
    star
}