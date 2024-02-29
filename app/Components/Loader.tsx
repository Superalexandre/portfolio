export default function Loader({ className }: { className?: string }) {
    return (
        <div className={`inline-block text-white animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}>

        </div>
    )
}