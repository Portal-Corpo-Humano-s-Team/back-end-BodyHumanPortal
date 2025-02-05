export interface IUser {
  id?: string;
  name: string;
  email: string;
  birthday: Date | string;
  password?: string;
}
export interface IUserLoginWithGoogle {
  token: string;
}

export interface IUserLoginTotp {
  user: Pick<IUser, "id" | "email">;
}

export interface IUserVerifyTotpToken {
  isValid: boolean;
  token: string;
}

export type TGeneralLogin = IUserLoginTotp | IUserLoginWithGoogle;
