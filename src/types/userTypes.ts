export interface IUser {
  id?: string;
  name: string;
  email: string;
  birthday: Date | string;
  password?: string;
}

export interface IUserLogin {
  token: string;
  user: Pick<IUser, "id" | "name" | "email" | "birthday">;
}
