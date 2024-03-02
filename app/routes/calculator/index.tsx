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
                className={`bg-slate-600 ${explosion ? "opacity-50 cursor-default" : "hover:bg-slate-800"} text-white rounded-md p-4 flex items-center justify-center ${className}`}
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
        <div className="bg-slate-700 min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-4">
            <h1 className="text-white text-3xl font-bold text-center flex flex-row items-center justify-center gap-2">
                <MdCalculate size={30} />

                Calculatrice
            </h1>

            <div className="flex flex-col gap-4 w-80">
                <div className="flex flex-col">
                    <h2 className="text-white text-bold text-2xl text-center w-full">Résultat : </h2>
                    <p className="text-white break-words">{result}</p>
                    {error ? <p className="text-red-500 text-sm">{error}</p> : null}
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
                        className="w-full h-full fixed top-1/2 left-1/2"
                        onComplete={() => setExplosion(false)}
                    /> : null}
            </div>
        </div>
    )
}