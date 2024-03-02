import Language from "./Language"
import Theme from "./Theme"

export default function Background({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={"dark:bg-slate-700 min-w-full min-h-full " + className}>
            <div className="fixed left-0 top-0 -z-10 h-full w-full"></div>

            <div className="fixed bottom-7 right-7 z-50 flex flex-col items-center justify-center gap-4">
                <Language />
                
                <Theme />
            </div>

            {children}
        </div>
    )
}