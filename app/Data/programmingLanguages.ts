interface ProgrammingLanguage {
    name: string;
    startedIn: number;
    approximativeLevel: number;
}

const programmingLanguages: ProgrammingLanguage[] = [
    {
        name: "JavaScript",
        startedIn: 2019,
        approximativeLevel: 70
    },
    {
        name: "TypeScript",
        startedIn: 2020,
        approximativeLevel: 60
    },
    {
        name: "Python",
        startedIn: 2020,
        approximativeLevel: 30
    }
]

export default programmingLanguages

export {
    programmingLanguages
}

export type {
    ProgrammingLanguage
}