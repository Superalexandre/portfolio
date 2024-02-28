interface ProgrammingLanguage {
    name: string;
    startedIn: number;
    approximativeLevel: number;
    type: "language" | "framework" | "library"
}

const programmingLanguages: ProgrammingLanguage[] = [
    {
        name: "JavaScript",
        startedIn: 2019,
        approximativeLevel: 70,
        type: "language"
    },
    {
        name: "TypeScript",
        startedIn: 2020,
        approximativeLevel: 60,
        type: "language"
    },
    {
        name: "Python",
        startedIn: 2020,
        approximativeLevel: 30,
        type: "language"
    },
    {
        name: "C#",
        startedIn: 2023,
        approximativeLevel: 15,
        type: "language"
    }, 
    {
        name: "HTML/CSS",
        startedIn: 2019,
        approximativeLevel: 80,
        type: "language"
    }, 
    {
        name: "React",
        startedIn: 2022,
        approximativeLevel: 50,
        type: "framework"
    }, 
    {
        name: "Node.js",
        startedIn: 2019,
        approximativeLevel: 60,
        type: "framework"
    },
    {
        name: "Astro",
        startedIn: 2023,
        approximativeLevel: 10,
        type: "framework"
    },
    {
        name: "Next.js",
        startedIn: 2023,
        approximativeLevel: 10,
        type: "framework"
    }
]

export default programmingLanguages

export {
    programmingLanguages
}

export type {
    ProgrammingLanguage
}