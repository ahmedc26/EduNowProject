import { Level } from "./level.model";
export interface Subject {
  id_subject: number;
  name_Subject?: string;
  level?: Level;
}
export interface Topic{
    idTopic?: number;
    name_Topic: string;
    fileName?: string;
    fileType?: string;
    filePath?: string;
    subject?: Subject;
    skills?: any[];
}