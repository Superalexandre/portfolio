export default class Timer {
    private startTime: number
    private endTime: number
    private duration: number
    private name: string

    constructor(name: string) {
        this.startTime = new Date().getTime()
        this.endTime = 0
        this.duration = 0

        this.name = name
    }

    end() {
        this.endTime = Date.now()
        this.duration = this.endTime - this.startTime

        console.log(`${this.name} took: ${this.duration}ms`)
    }
}