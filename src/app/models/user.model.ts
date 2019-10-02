export interface UserModel {
  username: string;
  dob: Date;
  email: string;
  country: number;
  friends: Array<string>;
  requests: Array<string>;
}
