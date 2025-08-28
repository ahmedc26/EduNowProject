import { Level } from "./level.model";


export interface Subject {
    id_subject?: number;
    name_Subject: string;
    level?: Level;
    topics?: any[];
}