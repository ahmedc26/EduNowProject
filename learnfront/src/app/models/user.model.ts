import {Role} from "./role.model"


export interface User {
    idUser: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: number;
    createdDate: Date;
    birthDate:Date;
    role?: Role;
}