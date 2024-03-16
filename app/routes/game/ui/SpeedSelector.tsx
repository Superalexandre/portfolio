import { MdFastForward, MdForward10, MdForward30, MdForward5, MdPause } from "react-icons/md"

interface SpeedSelectorProps {
    speed: number
    setSpeed: (speed: number) => void
}

const SpeedSelector = ({ speed, setSpeed }: SpeedSelectorProps) => {
    const speeds = [{
        value: 0,
        icon: MdPause
    }, {
        value: 0.5,
        icon: MdForward5
    }, {
        value: 1,
        icon: MdForward10
    }, {
        value: 1.5,
        icon: MdForward30
    }, {
        value: 3,
        icon: MdFastForward
    }]

    return (
        <div className="flex flex-row items-center justify-start gap-2">

            {speeds.map((speedValue, index) => (
                <button
                    key={index}
                    onClick={() => setSpeed(speedValue.value)}
                    className={`flex items-center justify-center ${speed === speedValue.value ? "text-green-500" : "text-black dark:text-white"}`}
                >
                    <speedValue.icon size={30} />
                </button>
            ))}
        </div>
    )
}

export default SpeedSelector
export { SpeedSelector }
export type { SpeedSelectorProps }