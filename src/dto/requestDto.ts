export class MoveRequest {
    public req: string = "move";
    public x: number;
    public y: number;
    public id: number = 0
}

export class ChgColorRequest {
    public req: string = "chgColor";
    public color: number;
    public x: number = 0;
    public y: number = 0
}