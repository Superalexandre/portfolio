import { createCookieSessionStorage } from "@remix-run/node"
import { redirect } from "@remix-run/node"

const SESSION_KEY = "token"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET as string],
        secure: process.env.NODE_ENV === "production",
    },
})

async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie")
    const sessionCookie = await sessionStorage.getSession(cookie)
    return sessionCookie
}

export async function logout(request: Request) {
    const session = await getSession(request)
    return redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    })
}

export async function createUserSession({
    request,
    token,
    redirectUrl = "/",
}: {
    request: Request;
    token: string;
    redirectUrl?: string;
}) {
    const session = await getSession(request)
    session.set(SESSION_KEY, token)

    return redirect(redirectUrl, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session, {
                maxAge: MAX_AGE,
            }),
        },
    })
}

export async function getUserToken(request: Request) {
    const session = await getSession(request)
    const token: string = session.get(SESSION_KEY)
    return token
}

export async function getUser(request: Request) {
    const token = await getUserToken(request)

    if (!token) return null

    return token
}

// export async function getUserSession(request: Request) {
//     const session = await getSession(request)
//     return session.get(SESSION_KEY)
// }