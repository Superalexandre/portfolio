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
    safelist: [
        "bg-[#C8A2C8]",
        "bg-[#FFC0CB]",
        "bg-[#EE4266]",
        "bg-[#F8B878]",
        "bg-[#D0A68C]",
        "bg-[#F0E68C]",
        "bg-[#98FB98]",
        "bg-[#87CEEB]",
    ],
    plugins: [
        require("@tailwindcss/typography"),
    ],
} satisfies Config