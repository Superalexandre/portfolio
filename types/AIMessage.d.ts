interface AIMessage {
    id: string
    content: string
    analyzing?: boolean
    date: Date
    author: "AI" | "User"
    time?: number
}

export default AIMessage
export { AIMessage }