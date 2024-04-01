export interface UserCreateRepository {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
}

export interface UserUpdateRepository {
  username?: string;
  googleId?: string;
  password?: string;
  phone?: string;
}
