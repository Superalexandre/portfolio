import { MetaFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLocation, useNavigation } from "@remix-run/react"
import { useState } from "react"
import { MdLogout, MdMenu, MdPerson, MdSettings, MdSms } from "react-icons/md"

export const meta: MetaFunction = () => {
    return [
        { title: "Votre profile" },
        { name: "description", content: "Votre profile" },
    ]
}

export default function Index() {
    const navigation = useNavigation()
    const location = useLocation()

    return (
        <div className="bg-slate-700 min-w-full h-full min-h-screen flex flex-row">
            <SideBar 
                location={location.pathname}
            />

            <div className={`${navigation.state === "loading" ? "block" : "hidden"} w-full min-h-full flex flex-col justify-center items-center gap-4`}>
                <div className="loader h-40 w-40" />
                <p className="text-center text-white">Chargement...</p>
            </div>

            <div className={`${navigation.state === "loading" ? "hidden" : "block"} w-full min-h-full`}>
                <Outlet />
            </div>
        </div>
    )
}

const SideBar = ({ location = "/account/profile/" }: { location: string | undefined }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                className={`absolute top-0 left-0 m-4 lg:hidden ${open ? "rotate-90" : ""} transition-all duration-150`}
                onClick={() => setOpen(!open)}
            >
                <MdMenu 
                    className="text-white" 
                    size={24}
                />
            </button>
            <div
                className={`absolute top-0 left-0 w-full h-full opacity-60 bg-black lg:hidden ${open ? "block" : "hidden"}`}
                onClick={() => setOpen(false)}
            >
            </div>

            <div className={`${open ? "translate-x-0" : "-translate-x-full"} bg-slate-800 min-w-52 h-full flex flex-col justify-between items-center py-4 lg:translate-x-0 fixed transition-all duration-150 z-10`}>
                <div className="h-auto flex flex-col gap-4 items-center justify-center">
                    <Link
                        to={"/account/profile"}
                        className={`${location === "/account/profile" ? "!text-slate-500" : ""} text-center text-white hover:text-slate-400 flex flex-row items-center justify-center gap-2`}
                    >
                        <MdPerson />

                        Mon profile
                    </Link>
                    
                    <Link 
                        to={"/account/profile/my-message"}
                        className={`${location === "/account/profile/my-message" ? "!text-slate-500" : ""} text-center text-white hover:text-slate-400 flex flex-row items-center justify-center gap-2`}
                    >
                        <MdSms />

                        Mes messages
                    </Link>

                    <Link
                        to={"/account/profile/settings"}
                        className={`${location === "/account/profile/settings" ? "!text-slate-500" : ""} text-center text-white hover:text-slate-400 flex flex-row items-center justify-center gap-2`}
                    >
                        <MdSettings />

                        Paramètres
                    </Link>
                </div>
                <Form action="/account/logout" method="post">
                    <button type="submit" className="text-center text-white hover:text-slate-400 flex flex-row items-center justify-center gap-2">
                        <MdLogout />

                        Déconnexion
                    </button>
                </Form>
            </div>
        </>
    )
}