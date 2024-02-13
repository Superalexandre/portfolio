import { MetaFunction } from "@remix-run/node"
import Background from "~/Components/Background"

export const meta: MetaFunction = () => {
    return [
        { title: "Ambin Informatique - Alexandre Renard" },
        { name: "description", content: "Portfolio d'Alexandre Renard" },
    ]
}

export default function Index() {
    return (
        <Background className="p-5">
            <div>
                <h1>Index</h1>
                <a href="/">Home</a>
            </div>
        </Background>
    )
}