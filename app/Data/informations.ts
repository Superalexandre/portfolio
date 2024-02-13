interface Information {
    birthDate: Date
}

const information: Information = {
    birthDate: new Date(2005, 2, 4, 10, 10, 0, 0)
}

export default information
export {
    information,
}
export type {
    Information
}