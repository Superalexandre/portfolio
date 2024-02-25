interface User {
    id: string
    token: string
    name: string
    firstName: string
    username: string
    birthDate: Date | string
    mail: string
    isVerified: boolean
    password: string
    salt: string
    lastConnection: Date | string
    updatedAt: Date | string
    createdAt: Date | string
    favoriteLanguage: string
    favoriteTheme: string
    avatarSeed: string
}

export default User
export {
    User
}