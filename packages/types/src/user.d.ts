export type User = {
  name: string,
  email: string,
  lastName: string,
  createdAt: Date,
  passwordHash: string,
}
export type UserResponse = User & {
  id: string
}
