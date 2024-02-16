export default class Logger {
    // constructor () {}

    // TODO: Add color and time to the log method
    static log(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }

    static error(message: string, ...args: unknown[]) {
        console.error(message, ...args)
    }

    static timer(name: string, duration: number) {
        console.log(`${name} took: ${duration}ms`)
    }

    // TODO: Add a warning method
}