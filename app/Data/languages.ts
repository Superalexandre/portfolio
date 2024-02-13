interface Language {
    name: string;
    code: string;
    level: string;
    image: string;
}

const imagePath = "/assets/flags/"
const languages: Language[] = [
    {
        name: "Français",
        code: "fr",
        level: "Native",
        image: imagePath + "fr.svg"
    },
    {
        name: "English",
        code: "en",
        level: "B2",
        image: imagePath + "gb.svg"
    },
    {
        name: "Español",
        code: "es",
        level: "A1",
        image: imagePath + "es.svg"
    }
]

export default languages

export {
    languages,
}

export type {
    Language
}