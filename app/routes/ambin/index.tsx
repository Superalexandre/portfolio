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
        <Background className="p-5 min-w-full h-full min-h-screen">
            <div>
                <h1>Index</h1>
                <a href="/" className="text-main-color">Home</a>
            </div>
        </Background>
    )
}