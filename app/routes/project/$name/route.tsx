import { useParams } from "@remix-run/react"

export const handle = { i18n: "common" }
export default function Index() {
    const params = useParams()

    return (
        <div>
            <h1>Project: {params.name}</h1>
        </div>
    )
}