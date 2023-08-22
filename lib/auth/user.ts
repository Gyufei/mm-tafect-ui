export interface IUser {
  name: string;
  email: string;
  token: string;
  expires: number;
  active: boolean;
  image?: string;
}
