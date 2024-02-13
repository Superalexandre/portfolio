import type { Config } from "tailwindcss"

export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            // Rouge
            colors: {
                "main-color": "#EC1C24",
            }
        },
    },
    plugins: [],
} satisfies Config