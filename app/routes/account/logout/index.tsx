import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { logout } from "~/session.server"

const redirectUrl = "/account/login"

export function action({ request }: ActionFunctionArgs) {
    return logout(request, redirectUrl)
}

export function loader() {
    return redirect(redirectUrl)
}