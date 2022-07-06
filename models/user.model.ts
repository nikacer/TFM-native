export interface Iuser {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  gener: "M" | "F";
  password: string;
}