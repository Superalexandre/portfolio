import { MutableRefObject } from "react"
import { v4 as uuid } from "uuid"

interface PendingRequest {
    requestId: string
    request: Promise<Response>
    abort: () => void
}

type PendingRequestRef = MutableRefObject<PendingRequest[]>

interface saveDatabaseProps {
    type: "line" | "station" | "train"
    action: "create" | "delete" | "update"
    gameId: string
    id: string
    data: unknown
}

const saveDatabase = ({ type, gameId, action, data, id }: saveDatabaseProps) => {
    const abortController = new AbortController()
    
    const req = fetch(`/game/${gameId}`, {
        signal: abortController.signal,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type,
            action: action,
            id: id,
            gameId,
            data
        })
    })

    return {
        requestId: uuid(),
        request: req,
        abort: () => abortController.abort(),
    } satisfies PendingRequest
}

export {
    saveDatabase
}

export type { saveDatabaseProps, PendingRequest, PendingRequestRef }