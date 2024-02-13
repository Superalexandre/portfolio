interface DateOptions extends Intl.DateTimeFormatOptions {
    lang: string
}

function formatDate(date: Date, options?: DateOptions): string {
    return date.toLocaleDateString(options?.lang || "fr-FR", options)
}

export { formatDate }
export type { DateOptions }