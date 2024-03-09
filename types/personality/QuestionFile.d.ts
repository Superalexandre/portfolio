interface QuestionFile {
    name: string
    prettyName: string
    questions: {
        question: string
        answers: {
            answer: string
            points: number
        }[]
    }[]
    results: {
        personnage: string
        minPoints: number
        maxPoints: number
    }[]
}

export default QuestionFile
export {
    QuestionFile
}