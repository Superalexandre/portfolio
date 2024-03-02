import { useKeyboardEvent } from "@react-hookz/web"
import { useState } from "react"
import ConfettiExplosion from "react-confetti-explosion"
import { MdBackspace, MdCalculate, MdDelete } from "react-icons/md"

export default function Index() {
    const [result, setResult] = useState("0")
    const [error, setError] = useState("")
    const [explosion, setExplosion] = useState(false)

    const handleCalculation = (value: string) => {
        setError("")

        if (value === "C") return setResult("0")
        if (value === "delete") {
            if (result.length === 1) return setResult("0")

            return setResult(result.toString().slice(0, -1))
        }

        if (value === "=") {
            try {
                const evalResult = eval(result)

                if (isNaN(evalResult)) throw new Error("Le calcul n'est invalide.")

                if (evalResult === Infinity) return setError("Division par zéro impossible.")

                setExplosion(true)

                setResult(evalResult.toString())

                return
            } catch (errorCalc) {
                return setError("Le calcul n'est invalide.")
            }
        }

        const signs = ["+", "-", "*", "/", ","]
        return setResult(result === "0" && !signs.includes(value) ? value : result + value)
    }

    const CalcButton = ({ value, displayValue, className = "" }: { value: string, displayValue?: string | JSX.Element, className?: string }) => {
        return (
            <button
                onClick={() => handleCalculation(value)}
                className={`bg-slate-600 ${explosion ? "cursor-default opacity-50" : "hover:bg-slate-800"} flex items-center justify-center rounded-md p-4 text-white ${className}`}
            >
                {displayValue ? displayValue : value}
            </button>
        )
    }

    useKeyboardEvent(true, (e) => {
        const key = e.key.toLowerCase()

        if (key === "enter" || key === "=") return handleCalculation("=")
        if (key === "backspace") return handleCalculation("delete")
        if (key === "escape" || key === "c") return handleCalculation("C")
        if (key === ",") return handleCalculation(",")

        if (key === "0" || key === "1" || key === "2" || key === "3" || key === "4" || key === "5" || key === "6" || key === "7" || key === "8" || key === "9" || key === "+" || key === "-" || key === "*" || key === "/") return handleCalculation(key)
    })

    return (
        <div className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-4 bg-slate-700">
            <h1 className="flex flex-row items-center justify-center gap-2 text-center text-3xl font-bold text-white">
                <MdCalculate size={30} />

                Calculatrice
            </h1>

            <div className="flex w-80 flex-col gap-4">
                <div className="flex flex-col">
                    <h2 className="text-bold w-full text-center text-2xl text-white">Résultat : </h2>
                    <p className="break-words text-white">{result}</p>
                    {error ? <p className="text-sm text-red-500">{error}</p> : null}
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <CalcButton value="1" />
                    <CalcButton value="2" />
                    <CalcButton value="3" />
                    <CalcButton value="+" />
                    <CalcButton value="4" />
                    <CalcButton value="5" />
                    <CalcButton value="6" />
                    <CalcButton value="-" />
                    <CalcButton value="7" />
                    <CalcButton value="8" />
                    <CalcButton value="9" />
                    <CalcButton value="*" />
                    <CalcButton value="0" />
                    <CalcButton value="=" />
                    <CalcButton value="/" />
                    <CalcButton value="," />
                    <CalcButton
                        className="col-span-2"
                        value="C"
                        displayValue={<MdDelete size={20} />}
                    />
                    <CalcButton
                        className="col-span-2"
                        value="delete"
                        displayValue={<MdBackspace size={20} />}

                    />
                </div>

                {explosion ?
                    <ConfettiExplosion
                        force={0.7}
                        duration={2_000}
                        particleCount={300}
                        className="fixed left-1/2 top-1/2 h-full w-full"
                        onComplete={() => setExplosion(false)}
                    /> : null}
            </div>
        </div>
    )
}