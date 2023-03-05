import { Repository } from "typeorm";
import { ModifCursorDTO } from "../dto/cursorDto";
import { ChgColorRequest } from "../dto/requestDto";
import { Cursor } from "../entity/Cursor";
import { DRepoCursor } from "../DynamicRepo/DRepoCursor";

export class NewPixelService{
    constructor(
        private cursorRepository: DRepoCursor,
    ){}

    create(cursor: ModifCursorDTO, chgcolor: ChgColorRequest): ChgColorRequest {

        const cursorEntity = this.cursorRepository.findOneById(cursor.idCursor)

        if(cursorEntity){
            // ! Log les pixels dans un fichier à part

            return {req: "chgColor", x: cursorEntity.positionX + chgcolor.x, y: cursorEntity.positionY + chgcolor.y, color: chgcolor.color}
        }
        return {req:"chgColor",x:0,y:0,color:-1}
    }

    
}