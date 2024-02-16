import { useWindowSize } from "@react-hookz/web"
import { useEffect, useState } from "react"
import Confetti from "react-confetti"

import information from "~/Data/informations"

export default function Birthday({ children }: { children: React.ReactNode }) {
    const { width, height } = useWindowSize()
    const [displayConfetti, setDisplayConfetti] = useState(true)

    // Check if the date is today
    const today = new Date()
    const birthDate = information.birthDate

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDisplayConfetti(false)
        }, 10_000)

        return () => {
            clearTimeout(timeout)

            setDisplayConfetti(true)
        }
    }, [])

    if (typeof window === "undefined") return <></>

    if (today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()) {
        return (
            <div>
                <Confetti
                    width={width || 0}
                    height={height || 0}
                    className={`${displayConfetti ? "block" : "hidden"} -z-10 overflow-hidden !fixed`}   
                >
                </Confetti>
                
                {children}
            </div>
        )
    }

    return children
}