import { useWindowSize } from "@react-hookz/web"
import Confetti from "react-confetti"

import information from "~/Data/informations"

export default function Birthday({ children }: { children: React.ReactNode }) {
    const { width, height } = useWindowSize()
    
    // Check if the date is today
    const today = new Date()
    const birthDate = information.birthDate

    if (today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()) {
        return (
            <div>
                <Confetti
                    width={width}
                    height={height}
                    className="-z-10 overflow-hidden !fixed"
                >
                </Confetti>
                
                {children}
            </div>
        )
    }

    return children
}