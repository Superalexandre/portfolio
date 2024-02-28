interface School {
    name: string
    startDate: string
    endDate: string
    code: string
}

const schools: School[] = [
    {
        "name": "Brevet",
        "code": "brevet",
        "startDate": "2019-09-01",
        "endDate": "2020-07-01"
    },
    {
        "name": "2nd générale et technologique",
        "code": "2nd",
        "startDate": "2020-09-01",
        "endDate": "2021-07-01"
    },
    {
        "name": "BAC STI2D",
        "code": "bac",
        "startDate": "2021-09-01",
        "endDate": "2023-07-01"
    },
    {
        "name": "BTS SIO",
        "code": "bts",
        "startDate": "2023-09-01",
        "endDate": "2025-07-01"
    }
]

export default schools

export {
    schools
}

export type {
    School
}