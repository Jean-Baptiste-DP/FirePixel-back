import { Repository } from "typeorm";
import { CreateCursorDTO } from "../dto/cursorDto";
import { MoveRequest } from "../dto/requestDto";
import { Cursor } from "../entity/Cursor";
import { Screen } from "../entity/Screen";

export class CursorService{
    constructor(
        private cursorRepository: Repository<Cursor>,
        private screenRepository: Repository<Screen>
    ){}

    async create(cursor: CreateCursorDTO): Promise<MoveRequest> {
        // TODO check if the cursor is already registered
        const screen = await this.screenRepository.findOneBy({id:cursor.idScreen})

        if(screen){
            const cursorEntity: Cursor = new Cursor();
        cursorEntity.screen = screen;

        cursorEntity.ip = cursor.ip;
        cursorEntity.positionX = Math.floor(Math.random() * screen.width);
        cursorEntity.positionY = Math.floor(Math.random() * screen.height);
        cursorEntity.idCursor = 0 // TODO À changer pour prendre un id de libre
    
        await this.cursorRepository.save(cursorEntity);
        return {req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.id}
        }
        return {req:"move",x:0,y:0,id:-1}
      }
}