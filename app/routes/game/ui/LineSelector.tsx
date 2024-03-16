import { MdCheck } from "react-icons/md"

import styles from "../style"

interface LineSelectorProps {
    color: string
    setColor: (color: string) => void
}

const LineSelector = ({ color, setColor }: LineSelectorProps) => {
    const colorLines = Object.values(styles.colors)

    return (
        <div className="flex flex-row items-center gap-2">
            <p className="dark:text-white">Lignes :</p>
            {colorLines.map((colorLine, index) => (
                <button
                    key={index} className={`bg-[${colorLine}] flex h-6 w-6 items-center justify-center rounded-full`}
                    onClick={() => setColor(colorLine)}
                >
                    {color === colorLine ? <MdCheck className="text-dark" /> : null}

                    <span className="sr-only">{colorLine}</span>
                </button>
            ))}
        </div>
    )
}

export default LineSelector
export { LineSelector }
export type { LineSelectorProps }