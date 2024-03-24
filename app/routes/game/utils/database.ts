interface saveDatabaseProps {
    type: "line" | "station" | "train"
    action: "create" | "delete" | "update"
    gameId: string
    id: string
    data: unknown
}

const saveDatabase = ({ type, gameId, action, data, id }: saveDatabaseProps) => {
    fetch(`/game/${gameId}`, {
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
}

export {
    saveDatabase
}