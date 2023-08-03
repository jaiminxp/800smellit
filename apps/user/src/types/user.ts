export enum UserRoles {
  Musician = 'Musician',
  Artist = 'Artist',
  Admin = 'admin',
}

export interface User {
  id: string
  email: string
  roles: UserRoles[]
}
