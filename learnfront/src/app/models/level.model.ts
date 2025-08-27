import { Subject } from "./subject.model";
export enum LevelType {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY'
}


export interface Level {
    idLevel?: number ;
    name_Level: string;
    level_Type: LevelType;
    subjects?: Subject[]; 

}