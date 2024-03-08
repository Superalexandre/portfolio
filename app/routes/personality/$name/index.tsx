import { LoaderFunctionArgs, redirect, json, ActionFunctionArgs } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react"
import { Dispatch, SetStateAction, useState } from "react"
import { MdArrowBack, MdDone } from "react-icons/md"

import { getQuestions } from "./getQuestions"

export function loader({ params }: LoaderFunctionArgs) {
    if (!params || !params.name) return redirect("/personality")

    const questions = getQuestions(params.name)

    if (!questions) return redirect("/personality")

    return json({ questions })
}

export async function action({ request, params }: ActionFunctionArgs) {
    if (!params || !params.name) return redirect("/personality")

    // Get form data
    const body = await request.formData()
    const repliesString = body.get("replies")

    if (!repliesString) return redirect(`/personality/${params.name}`)

    const replies = JSON.parse(repliesString as string)

    const questions = getQuestions(params.name)
    if (!questions) return redirect("/personality")

    const results = questions.results
    const totalPoints = replies.reduce((acc: number, curr: { points: number, reply: number }) => acc + curr.points, 0)

    // Find the personality based on the total points
    const personality = results.find(result => {
        return totalPoints >= result.minPoints && totalPoints <= result.maxPoints
    })

    return {
        success: true,
        error: false,
        personality: personality?.personnage || "Personnalité inconnue"
    }
}

export default function Index() {
    const navigate = useNavigate()

    const { questions } = useLoaderData<typeof loader>()
    const result = useActionData<typeof action>()

    const [question, setQuestion] = useState(0)
    const [replies, setReplies] = useState<{ points: number, reply: number }[]>([])

    const totalPoints = replies.reduce((acc, curr) => acc + curr.points, 0)

    if (question >= questions.questions.length) {
        if (result) return <Result
            name={questions.name}
            personality={result.personality}
        />

        return <Success name={questions.name} replies={replies} />
    }

    const questionTitle = questions.questions[question].question
    const answers = questions.questions[question].answers

    return (
        <div className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-32 bg-slate-700 pt-2 lg:gap-64 lg:pt-0">
            <div className="flex w-full flex-row items-center justify-between px-14">
                <button
                    onClick={() => {
                        if (question === 0) return navigate("/personality")

                        setQuestion((prev) => prev - 1)
                        setReplies((prev) => prev.slice(0, -1))
                    }}
                    className="rounded-lg bg-slate-800 p-4 text-white"
                >
                    <MdArrowBack />
                </button>

                <div className="flex flex-row items-center justify-center gap-4">
                    <p className="text-white">Question {question + 1}/{questions.questions.length}</p>
                    <p className="text-white">Points: {totalPoints}</p>
                </div>
            </div>
            <h1 className="text-center text-3xl font-bold text-white">{questionTitle}</h1>
            <div className="grid w-full grid-cols-2 grid-rows-2 gap-4 px-0 lg:px-14">
                {answers.map((answer, index) => (
                    <QuestionButton
                        key={index}
                        index={index}
                        answer={answer.answer}
                        points={answer.points}
                        setReplies={setReplies}
                        setQuestion={setQuestion}
                    />
                ))}
            </div>
        </div>
    )
}

interface QuestionButtonProps {
    index: number
    answer: string
    points: number
    setReplies: Dispatch<SetStateAction<{
        points: number;
        reply: number;
    }[]>>
    setQuestion: Dispatch<SetStateAction<number>>
}

const QuestionButton = ({ index, answer, points, setReplies, setQuestion }: QuestionButtonProps) => {
    const colors = ["bg-[#87CEEB]", "bg-[#E7A1B0]", "bg-[#B6D098]", "bg-[#F2E394]"]

    return (
        <button
            className={`${colors[index]} rounded-xl p-10 text-center font-bold text-white hover:rounded-md hover:text-black`}
            onClick={() => {
                setReplies((prev) => [...prev, { points, reply: index }])
                setQuestion((prev) => prev + 1)
            }}
        >
            {answer}
        </button>
    )
}

const Success = ({ name, replies }: { name: string, replies: { points: number; reply: number; }[] }) => {
    const submit = useSubmit()

    return (
        <Form
            method="post"
            action={`/personality/${name}`}
            className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-64 bg-slate-700"
            onSubmit={(event) => {
                event.preventDefault()

                submit({
                    "replies": JSON.stringify(replies)
                }, { method: "post", action: `/personality/${name}` })
            }}
        >
            <p className="text-center text-3xl font-bold text-white">
                Wow bravo tu as fini de répondre à toutes les questions
            </p>

            <button
                type="submit"
                className="flex flex-row items-center justify-center gap-2 rounded-lg bg-green-500 p-4 text-white hover:bg-green-800"
            >
                Voir les résultats

                <MdDone />
            </button>
        </Form>
    )
}

const Result = ({ name, personality }: { name: string, personality: string }) => {
    return (
        <div className="flex h-full min-h-screen min-w-full flex-col items-center justify-between gap-7 bg-slate-700 py-14">
            <h1 className="text-3xl font-bold text-white">Résultats</h1>

            <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-white">Vous êtes</p>

                <p className="text-center text-3xl font-bold text-white">{personality}</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
                <a href="/personality" className="text-white hover:text-black">Faire un autre test</a>
                <a href={`/personality/${name}`} className="text-white hover:text-black">Refaire ce test</a>
            </div>
        </div>
    )
}