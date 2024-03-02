import { Form, Link, Outlet, useLocation, useNavigation } from "@remix-run/react"
import { TFunction } from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MdLogout, MdMenu, MdPerson, MdSettings, MdSms } from "react-icons/md"

export const handle = { i18n: "common" }
export default function Index() {
    const navigation = useNavigation()
    const location = useLocation()

    const { t } = useTranslation("common")

    return (
        <div className="flex h-full min-h-screen min-w-full flex-row bg-slate-700">
            <SideBar 
                t={t}
                location={location.pathname}
            />

            <div className={`${navigation.state === "loading" ? "block" : "hidden"} flex min-h-full w-full flex-col items-center justify-center gap-4`}>
                <div className="loader h-40 w-40" />
                <p className="text-center text-white">{t("loading")}</p>
            </div>

            <div className={`${navigation.state === "loading" ? "hidden" : "block"} min-h-full w-full`}>
                <Outlet />
            </div>
        </div>
    )
}

const SideBar = ({ location = "/account/profile/", t }: { location: string | undefined, t: TFunction<"common", undefined> }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                className={`absolute left-0 top-0 m-4 lg:hidden ${open ? "rotate-90" : ""} transition-all duration-150`}
                onClick={() => setOpen(!open)}
            >
                <MdMenu 
                    className="text-white" 
                    size={24}
                />
            </button>
            <div
                className={`absolute left-0 top-0 h-full w-full bg-black opacity-60 lg:hidden ${open ? "block" : "hidden"}`}
                onClick={() => setOpen(false)}
                aria-hidden="true"
            >
            </div>

            <div className={`${open ? "translate-x-0" : "-translate-x-full"} fixed z-10 flex h-full min-w-52 flex-col items-center justify-between bg-slate-800 py-4 transition-all duration-150 lg:translate-x-0`}>
                <div className="flex h-auto flex-col items-center justify-center gap-4">
                    <Link
                        to={"/account/profile"}
                        className={`${location === "/account/profile" ? "!text-slate-500" : ""} flex flex-row items-center justify-center gap-2 text-center text-white hover:text-slate-400`}
                    >
                        <MdPerson />

                        {t("profile.myProfile")}
                    </Link>
                    
                    <Link 
                        to={"/account/profile/my-message"}
                        className={`${location === "/account/profile/my-message" ? "!text-slate-500" : ""} flex flex-row items-center justify-center gap-2 text-center text-white hover:text-slate-400`}
                    >
                        <MdSms />

                        {t("profile.myMessages.title")}
                    </Link>

                    <Link
                        to={"/account/profile/settings"}
                        className={`${location === "/account/profile/settings" ? "!text-slate-500" : ""} flex flex-row items-center justify-center gap-2 text-center text-white hover:text-slate-400`}
                    >
                        <MdSettings />

                        {t("profile.settings.title")}
                    </Link>
                </div>
                <Form action="/account/logout" method="post">
                    <button type="submit" className="flex flex-row items-center justify-center gap-2 text-center text-white hover:text-slate-400">
                        <MdLogout />

                        {t("profile.logout")}
                    </button>
                </Form>
            </div>
        </>
    )
}