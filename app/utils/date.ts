interface DateOptions extends Intl.DateTimeFormatOptions {
    lang: string
}

function formatDate(date: Date | string, options?: DateOptions): string {
    return new Date(date).toLocaleDateString(options?.lang || "fr-FR", options)
}

export { formatDate }
export type { DateOptions }