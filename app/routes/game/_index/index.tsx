import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { useState } from "react"
import { MdAdd, MdClose, MdDelete, MdEdit, MdSearch } from "react-icons/md"

import { getUser } from "~/session.server"
import { DateOptions, formatDate } from "~/utils/date"

import { createGame, deleteGame, editGame, getUserGame } from "../utils/game"

export async function action({ request }: ActionFunctionArgs) {
    const user = await getUser(request)
    if (!user) return redirect("/login?redirectUrl=/game")

    const formData = await request.formData()

    const actionValue = formData.get("action")
    const [actionType, actionId] = actionValue?.toString().split(" ") || []
    const userGame = await getUserGame(user) || null

    if (!actionType || actionType === "create") {
        const name = formData.get("nameGame")
        const seed = formData.get("seed")

        if (!name) return json({ message: "Veuillez remplir tous les champs", userGameUpdated: userGame }, { status: 400 })

        const result = await createGame({ user: user, name: name.toString(), seed: seed?.toString() })
        if (!result) return json({ message: "Erreur lors de la création de la partie", userGameUpdated: userGame }, { status: 400 })

        if (result.id) return redirect(`/game/${result.id}`)

        return redirect("/game")
    } else if (actionType === "delete" && actionId) {
        const { result, userGame: userGameUpdated } = await deleteGame({ user, gameId: actionId })

        if (!result) return json({ message: "Erreur lors de la suppression de la partie", userGameUpdated: userGame }, { status: 400 })

        return json({
            userGameUpdated: userGameUpdated || null
        })
    } else if (actionType === "edit" && actionId) {
        const name = formData.get("nameGame")

        if (!name) return json({ message: "Veuillez remplir tous les champs", userGameUpdated: userGame }, { status: 400 })

        const { result, userGame: userGameUpdated } = await editGame({ user, gameId: actionId, name: name.toString() })

        if (!result) return json({ message: "Erreur lors de la modification de la partie", userGameUpdated: userGame }, { status: 400 })

        return json({
            userGameUpdated: userGameUpdated || null
        })
    } else {
        return json({ message: `Unknown actionType ${actionType}`, userGameUpdated: userGame }, { status: 400 })
    }
}

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await getUser(request)
    if (!user) return redirect("/login?redirectUrl=/game")

    const userGame = await getUserGame(user)

    return json({
        user: user,
        userGame: userGame || null
    })
}


export default function Index() {
    const { userGame } = useLoaderData<typeof loader>()
    const { userGameUpdated } = useLoaderData<typeof action>()

    const [createPopupHidden, setCreatePopupHidden] = useState(true)

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#EBEBEB] dark:bg-[#070F2B]">
            <NewGame hidden={createPopupHidden} setHidden={() => setCreatePopupHidden(!createPopupHidden)} />
            <button
                className="fixed bottom-0 right-0 m-4 flex items-center justify-center gap-2 rounded-md bg-green-500 p-2 px-4 text-white hover:bg-green-600 dark:bg-green-400 dark:text-white dark:hover:bg-green-500"
                onClick={() => setCreatePopupHidden(!createPopupHidden)}
            >
                Nouvelle partie

                <MdAdd size={16} />
            </button>

            <div className="mt-9 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-black dark:text-white">Vos parties</h1>

                <div className="relative">
                    <input
                        className="rounded-md border border-slate-800 bg-slate-700 p-2 px-4 text-white dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                        type="text"
                        placeholder="Rechercher"
                    />

                    <MdSearch className="absolute right-0 top-0 mr-2 h-full w-6 hover:cursor-pointer dark:text-white" />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
                {userGameUpdated && Array.isArray(userGameUpdated.games) ? userGameUpdated.games.map((game) => {
                    return <DisplayGame
                        key={game.game.id}
                        game={game.game}
                        gameLine={game.lines.length}
                        gameStation={game.stations.length}
                        gameTrain={game.trains.length}
                    />
                }) : userGame ? userGame.games.map((game) => {
                    return <DisplayGame
                        key={game.game.id}
                        game={game.game}
                        gameLine={game.lines.length}
                        gameStation={game.stations.length}
                        gameTrain={game.trains.length}
                    />
                }) : (
                    <p className="font-bold text-black dark:text-white">
                        {"Vous n'avez pas de partie"}
                    </p>
                )}
            </div>
        </div>
    )
}

interface DisplayGameProps {
    game: {
        id: string
        name: string
        createdAt: string
        updatedAt: string
        canvasWidth: number
        canvasHeight: number
        userId: string | null
        seed: string | null
    }
    gameLine: number
    gameStation: number
    gameTrain: number

}

const DisplayGame = ({ game, gameLine, gameStation, gameTrain }: DisplayGameProps) => {
    const [editPopupHidden, setEditPopupHidden] = useState(true)

    const options: DateOptions = {
        lang: "fr-FR",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    }

    return (
        <>
            <EditGame hidden={editPopupHidden} setHidden={() => setEditPopupHidden(!editPopupHidden)} game={game} />

            <div key={game.id} className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-slate-700 px-20 py-5 hover:rounded-sm dark:bg-slate-700">
                <Link to={`/game/${game.id}`} className="group flex flex-col items-center justify-center gap-4">
                    <h2 className="text-lg font-bold text-black dark:text-white dark:group-hover:text-black">{game.name}</h2>
                    {/* <p className="text-black dark:text-white">{game.id}</p> */}
                    <div className="fle flex-col items-center justify-center">
                        <p className="text-center text-black dark:text-white dark:group-hover:text-black">Crée le {formatDate(game.createdAt, options)}</p>
                        <p className="text-center text-black dark:text-white dark:group-hover:text-black">Mise a jour le {formatDate(game.createdAt, options)}</p>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <p className="text-center text-black dark:text-white dark:group-hover:text-black">Lignes: {gameLine}</p>
                        <p className="text-center text-black dark:text-white dark:group-hover:text-black">Stations: {gameStation}</p>
                        <p className="text-center text-black dark:text-white dark:group-hover:text-black">Trains: {gameTrain}</p>
                    </div>
                </Link>

                <Form
                    method="post"
                    action="/game"
                    className="flex flex-row items-center justify-center gap-4"
                >
                    <button
                        type="button"
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-green-500 p-2 px-4 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500"
                        name="action"
                        value={`edit ${game.id}`}
                        onClick={() => setEditPopupHidden(!editPopupHidden)}
                    >
                        Éditer

                        <MdEdit size={16} />
                    </button>

                    <button
                        type="submit"
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-red-500 p-2 px-4 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500"
                        name="action"
                        value={`delete ${game.id}`}
                    >
                        Supprimer

                        <MdDelete size={16} />
                    </button>
                </Form>
            </div>
        </>
    )
}

interface NewGameProps {
    hidden: boolean
    setHidden: () => void

}

const NewGame = ({ hidden, setHidden }: NewGameProps) => {
    return (
        <Form
            method="post"
            action="/game"
            className={`${hidden ? "hidden" : "block"} fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-80`}
        >
            <div className="relative z-50 m-8 flex flex-col items-center justify-center gap-8 rounded-md bg-slate-400 px-32 py-12 dark:bg-slate-700 lg:m-0">
                <button
                    onClick={setHidden}
                    className="absolute right-0 top-0 m-4 hover:text-white dark:text-white dark:hover:text-black"
                >
                    <MdClose size={16} />
                </button>

                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <label
                            className="text-white dark:text-white"
                            htmlFor="nameGame"
                        >
                            Créer une nouvelle partie
                        </label>
                        <input
                            className="w-80 rounded-md border border-slate-800 bg-slate-700 p-2 px-4 text-white dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                            type="text"
                            placeholder="Nom de la partie"
                            name="nameGame"
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <label
                            className="text-white dark:text-white"
                            htmlFor="seed"
                        >
                            Seed
                        </label>
                        <input
                            className="w-80 rounded-md border border-slate-800 bg-slate-700 p-2 px-4 text-white dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                            type="text"
                            placeholder="Seed"
                            name="seed"
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex flex-row items-center justify-center gap-4">
                        <button
                            className="flex flex-row items-center justify-center gap-2 rounded-md bg-green-500 p-2 px-4 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500"
                            type="submit"
                            name="action"
                            value="create"
                        >
                            Créer

                            <MdAdd size={16} />
                        </button>
                        <button
                            onClick={setHidden}
                            className="flex flex-row items-center justify-center gap-2 rounded-md bg-red-500 p-2 px-4 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500"
                            type="reset"
                        >
                            Annuler

                            <MdClose size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    )
}


interface EditGameProps {
    hidden: boolean
    setHidden: () => void
    game: {
        id: string
        name: string
        createdAt: string
        updatedAt: string
        canvasWidth: number
        canvasHeight: number
        userId: string | null
        seed: string | null
    }
    // gameLine: number
    // gameStation: number
    // gameTrain: number
}

const EditGame = ({ hidden, setHidden, game }: EditGameProps) => {
    return (
        <Form
            method="post"
            action="/game"
            className={`${hidden ? "hidden" : "block"} fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-80`}
        >
            <div className="relative z-50 m-8 flex flex-col items-center justify-center gap-8 rounded-md bg-slate-400 px-32 py-12 dark:bg-slate-700 lg:m-0">
                <button
                    onClick={setHidden}
                    className="absolute right-0 top-0 m-4 hover:text-white dark:text-white dark:hover:text-black"
                >
                    <MdClose size={16} />
                </button>

                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <label
                            className="text-white dark:text-white"
                            htmlFor="nameGame"
                        >
                            Nom de la partie
                        </label>
                        <input
                            className="w-80 rounded-md border border-slate-800 bg-slate-700 p-2 px-4 text-white dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                            type="text"
                            placeholder="Nom de la partie"
                            name="nameGame"
                            autoComplete="off"
                            defaultValue={game.name}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <label
                            className="text-white dark:text-white"
                            htmlFor="seed"
                        >
                            Seed de la partie
                        </label>
                        <input
                            className="w-80 rounded-md border border-slate-800 bg-slate-700 p-2 px-4 text-white dark:border-slate-500 dark:bg-slate-700 dark:text-white"
                            type="text"
                            placeholder="Nom de la partie"
                            name="nameGame"
                            autoComplete="off"
                            defaultValue={game.seed || ""}
                            disabled={true}
                        />
                    </div>

                    <div className="flex flex-row items-center justify-center gap-4">
                        <button
                            className="flex flex-row items-center justify-center gap-2 rounded-md bg-green-500 p-2 px-4 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500"
                            type="submit"
                            name="action"
                            value={`edit ${game.id}`}
                            onClick={setHidden}
                        >
                            Éditer

                            <MdEdit size={16} />
                        </button>
                        <button
                            onClick={setHidden}
                            className="flex flex-row items-center justify-center gap-2 rounded-md bg-red-500 p-2 px-4 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500"
                            type="reset"
                        >
                            Fermer

                            <MdClose size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    )
}