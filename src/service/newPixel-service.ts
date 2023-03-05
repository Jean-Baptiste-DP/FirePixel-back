import { Repository } from "typeorm";
import { ModifCursorDTO } from "../dto/cursorDto";
import { ChgColorRequest } from "../dto/requestDto";
import { Cursor } from "../entity/Cursor";
import { DRepoCursor } from "../DynamicRepo/DRepoCursor";
import { DRepoScreen } from "../DynamicRepo/DRepoScreen";

export class NewPixelService{
    constructor(
        private cursorRepository: DRepoCursor,
        private screenRepository: DRepoScreen
    ){}

    async create(cursor: ModifCursorDTO, chgcolor: ChgColorRequest): Promise<ChgColorRequest> {

        const cursorEntity = this.cursorRepository.findOneById(cursor.idCursor)
        const screen = await this.screenRepository.findOne()

        if(cursorEntity && screen){
            // ! Log les pixels dans un fichier à part

            let posX = Math.max(Math.min(cursorEntity.positionX + chgcolor.x, screen.width), 0);
            let posY = Math.max(Math.min(cursorEntity.positionY + chgcolor.y, screen.height), 0);

            return {req: "chgColor", x: posX, y: posY, color: chgcolor.color}
        }
        return {req:"chgColor",x:0,y:0,color:-1}
    }

    
}