import Database from "better-sqlite3"
import { and, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { v4 as uuid } from "uuid"

import { databasePath } from "@/database/path"
import { game, gameLine, gameStation, gameTrain } from "@/database/schema/game"
import User from "@/types/User"

import { Line } from "./line"
import { Station, getSeedStations } from "./station"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config"

async function createGame({ user, name, seed }: { user: User, name: string, seed?: string }) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const gameId = uuid()

    const canvasWidth = CANVAS_WIDTH
    const canvasHeight = CANVAS_HEIGHT

    const gameCreated = await db
        .insert(game)
        .values({
            name: name,
            seed: seed || null,
            id: gameId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            userId: user.id
        })

    const stations = getSeedStations({ seed: seed, canvasWidth, canvasHeight })

    for (const station of stations) {
        await db
            .insert(gameStation)
            .values({
                id: station.id,
                gameId,
                x: station.x,
                y: station.y,
                shape: station.shape,
                highlighted: false
            })
    }

    return {
        id: gameId,
        game: gameCreated,
        stations
    }
}

async function deleteGame({ user, gameId }: { user: User, gameId: string }) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const gameResult = await db
        .delete(game)
        .where(
            and(
                eq(game.id, gameId),
                eq(game.userId, user.id)
            )
        )

    if (gameResult.changes === 0) return { result: false }

    const userGame = await getUserGame(user)

    return {
        result: gameResult,
        userGame
    }
}

async function editGame({ user, gameId, name }: { user: User, gameId: string, name: string }) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const gameResult = await db
        .update(game)
        .set({
            name
        })
        .where(
            and(
                eq(game.id, gameId),
                eq(game.userId, user.id)
            )
        )

    if (gameResult.changes === 0) return { result: false }

    const userGame = await getUserGame(user)

    return {
        result: gameResult,
        userGame
    }
}

async function getUserGame(user: User | null) {
    if (!user) return null

    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const gamesResult = await db
        .select()
        .from(game)
        .where(
            eq(game.userId, user.id)
        )

    if (gamesResult.length === 0 || !gamesResult) return null

    const games = []

    for (const gameResult of gamesResult) {
        const stations = await getStations(gameResult.id)
        const lines = await getLines(gameResult.id)
        const trains = await getTrains(gameResult.id)

        games.push({
            game: gameResult,
            stations,
            lines: lines,
            trains
        })
    }

    return {
        games
    }
}

async function getGameById(gameId: string, user: User) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const gameResult = await db
        .select()
        .from(game)
        .where(
            and(
                eq(game.id, gameId),
                eq(game.userId, user.id)
            )
        )

    if (gameResult.length === 0 || !gameResult) return null

    const stations: Station[] = await getStations(gameId)
    const lines = await getLines(gameId)
    const trains = await getTrains(gameId)

    return {
        ...gameResult[0],
        stations,
        lines: lines as unknown as Line[],
        trains
    }
}

async function getStations(gameId: string) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const stations = await db
        .select()
        .from(gameStation)
        .where(
            eq(gameStation.gameId, gameId)
        )

    return stations
}

async function getLines(gameId: string) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const lines = await db
        .select()
        .from(gameLine)
        .where(
            eq(gameLine.gameId, gameId)
        )

    return lines
}

async function getTrains(gameId: string) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const trains = await db
        .select()
        .from(gameTrain)
        .where(
            eq(gameTrain.gameId, gameId)
        )

    return trains
}

interface saveDatabaseProps {
    type: "line" | "station" | "train"
    action: "create" | "delete" | "update"
    gameId: string
    id: string
    data: Line
}

async function serverSaveDatabase({ type, gameId, action, data, id }: saveDatabaseProps) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const tables = {
        line: gameLine,
        station: gameStation,
        train: gameTrain
    }

    const table = tables[type]

    if (action === "create") {
        let values

        if (type === "line") {
            values = {
                gameId: gameId,
                id: data.id,
                from: typeof data.from === "string" ? data.from : data.from.id,
                to: typeof data.to === "string" ? data.to : data.to.id,
                color: data.color
            }
        }

        if (!values) return

        await db
            .insert(tables.line)
            .values(values)
    } else if (action === "delete") {
        await db
            .delete(table)
            .where(
                eq(table.id, id)
            )
    }
}

export {
    createGame,
    deleteGame,
    editGame,
    getUserGame,
    getGameById,
    serverSaveDatabase
}