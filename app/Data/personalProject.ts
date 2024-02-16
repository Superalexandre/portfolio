interface PersonalProject {
    name: string
    id: string
    urls?: Array<{
        name: string
        url: string
    }>
    technologies: string[]
    statistics?: Array<{
        type: "hours" | "followers" | "publications",
        value: number
    }>
    createdAt: Date
    endedAt?: Date
}

/*
"notFound": "Aucun projet trouvé",
"sudref": {
    "description": "Création de mon premier projet, qui s'appellera Sudref, il servira à automatiser des tâches sur Discord"
},
"gamebot": {
    "description": "Création de mon deuxième projet, qui s'appellera GameBot, il servira à automatiser des tâches sur Discord ainsi que sur navigateur, le but étant de reproduire des jeux (puissance4, morpion, etc.)"
},
"kouisine": {
    "description": "Kouisine Grandmont un projet crée a deux, il envoie le menu de la semaine au lycée grandmont, un envoie qui se fait sur Instagram, sur le site et l'application (uniquement Android) crée pour cette occasion, le menu été récupéré sur le pdf du lycée"
}
*/

const personalProjects: PersonalProject[] = [
    {
        name: "Sudref",
        id: "sudref",
        technologies: [
            "JavaScript",
            "HTML",
            "CSS",
        ],
        createdAt: new Date("2020-01-16"),
        endedAt: new Date("2022-01-23")
    },
    {
        name: "Game Bot",
        id: "game-bot",
        urls: [
            {
                "name": "GitHub",
                "url": "https://github.com/Superalexandre/game-bot"
            }
        ],
        technologies: [
            "JavaScript",
            "HTML",
            "CSS",
            "EJS"
        ],
        statistics: [
            {
                type: "hours",
                value: 66.52
            }
        ],
        createdAt: new Date("2021-05-29"),
        endedAt: new Date("2022-05-22"),
    },
    {
        name: "Kouisine Grandmont",
        id: "kouisine-grandmont",
        urls: [
            {
                name: "Instagram",
                url: "https://www.instagram.com/kouisine_grandmont/"
            }
        ],
        technologies: [
            "TypeScript",
            "Dart (Flutter)",
            "Astro",
            "React",
            "HTML",
            "CSS (TailwindCSS)",
        ],
        statistics: [
            {
                type: "hours",
                value: 282.37
            }, {
                type: "followers",
                value: 900
            }, {
                type: "publications",
                value: 283
            }
        ],
        createdAt: new Date(2021, 10, 3),
        endedAt: new Date(2022, 5, 1)
    }
]

export default personalProjects
export {
    personalProjects
}
export type { PersonalProject }
