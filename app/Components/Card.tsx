export default function Card({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={`dark:bg-slate-800 bg-slate-200 flex justify-center flex-col items-center py-10 rounded-lg dark:border-slate-600 border-slate-300 border-2 gap-10 ${className}`}>
            {children}
        </div>
    )
}