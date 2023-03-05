import { Cursor } from "../entity/Cursor";

export class DRepoCursor{
    public cursorList : Cursor[] = new Array(16);

    findOneById(id : number): Cursor{
        return this.cursorList[id]
    }

    save(curseur : Cursor): void{
        this.cursorList[curseur.idCursor] = curseur
    }
}