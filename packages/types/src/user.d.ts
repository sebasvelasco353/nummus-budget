type UserBase = {
  name: string,
  email: string,
  lastName: string,
}
export type User = UserBase & {
  createdAt: Date,
  passwordHash: string,
}
export type UserResponse = User & {
  id: string
}
export type UserSignIn = UserBase & {
  password: string
}
