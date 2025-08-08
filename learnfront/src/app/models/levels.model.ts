export enum LevelType {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY'
}


export interface Levels {
    idLevel?: number;
    name_Level: string;
    level_Type: LevelType;

}