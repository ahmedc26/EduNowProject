export interface LoginHistory {
  id: number;
  user: {
    idUser: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  loginTime: string;
  logoutTime?: string;
  isActive: boolean;
}
