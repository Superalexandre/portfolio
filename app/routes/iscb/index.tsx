import { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"

import Background from "~/Components/Background"

export const handle = { i18n: "common" }
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
                <Link to="/" className="text-main-color">Home</Link>
            </div>
        </Background>
    )
}