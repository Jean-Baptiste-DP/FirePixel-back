export class CreateCursorDTO {
    public ip: string;
    public idScreen: number;
    public idCursor: number;
    public changed: boolean
}

export class ModifCursorDTO {
    public idCursor: number;
    public idScreen: number
}