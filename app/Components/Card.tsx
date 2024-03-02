export default function Card({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-10 rounded-lg border-2 border-slate-300 bg-slate-200 py-10 dark:border-slate-600 dark:bg-slate-800 ${className}`}>
            {children}
        </div>
    )
}