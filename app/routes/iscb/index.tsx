import { MetaFunction } from "@remix-run/node"

import Background from "~/Components/Background"

export const meta: MetaFunction = () => {
    return [
        { title: "ISCB - Alexandre Renard" },
        { name: "description", content: "Portfolio d'Alexandre Renard" },
    ]
}


export default function Index() {
    return (
        <Background className="h-full min-h-screen min-w-full p-5">
            <div>
                <h1>ISCB</h1>
                <a href="/" className="text-main-color">Home</a>
            </div>
        </Background>
    )
}