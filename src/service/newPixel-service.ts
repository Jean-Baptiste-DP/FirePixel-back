import { Repository } from "typeorm";
import { ModifCursorDTO } from "../dto/cursorDto";
import { ChgColorRequest } from "../dto/requestDto";
import { Cursor } from "../entity/Cursor";

export class NewPixelService{
    constructor(
        private cursorRepository: Repository<Cursor>,
    ){}

    async create(cursor: ModifCursorDTO, chgcolor: ChgColorRequest): Promise<ChgColorRequest> {

        const cursorEntity = await this.cursorRepository.findOne(
            {
                where:{
                    idCursor: cursor.idCursor
                },
                order:{
                    firstConnection:"DESC"
                }
            }
        )

        if(cursorEntity){
            // ! Log les pixels dans un fichier à part

            return {req: "chgColor", x: cursorEntity.positionX + chgcolor.x, y: cursorEntity.positionY + chgcolor.y, color: chgcolor.color}
        }
        return {req:"chgColor",x:0,y:0,color:-1}
    }

    
}