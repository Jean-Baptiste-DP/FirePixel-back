import { CreateCursorDTO, ModifCursorDTO } from "../dto/cursorDto";
import { MoveRequest } from "../dto/requestDto";
import { DRepoScreen } from "../DynamicRepo/DRepoScreen";
import { DRepoCursor } from "../DynamicRepo/DRepoCursor";
import { Cursor } from "../entity/Cursor";

export class CursorService{
    constructor(
        private cursorRepository: DRepoCursor,
        private screenRepository: DRepoScreen
    ){}

    async create(cursor: CreateCursorDTO): Promise<MoveRequest> {

        if(cursor.changed){
            const screen = await this.screenRepository.findOne()

            if(screen){
                const cursorEntity: Cursor = new Cursor();
                cursorEntity.idScreen = screen.id;

                cursorEntity.ip = cursor.ip;
                cursorEntity.positionX = Math.floor(Math.random() * screen.width);
                cursorEntity.positionY = Math.floor(Math.random() * screen.height);
                cursorEntity.idCursor = cursor.idCursor
            
                this.cursorRepository.save(cursorEntity);

                return {req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
            }
            console.log("Aucun écran trouvé")
            return {req:"move",x:0,y:0,id:-1}
        }else{
            const cursorEntity = this.cursorRepository.findOneById(cursor.idCursor)
            if(cursorEntity){
                return{req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
            }
            else{
                console.log("Aucun curseur trouvé")
                return {req:"move",x:0,y:0,id:-1}
            }
        }
    }

    async move(cursor: ModifCursorDTO, move: MoveRequest):Promise<MoveRequest>{
        const cursorEntity = this.cursorRepository.findOneById(cursor.idCursor)
        const screen = await this.screenRepository.findOne()

        if(cursorEntity && screen){
            cursorEntity.positionX= Math.max(Math.min(cursorEntity.positionX+move.x, screen.width), 0);
            cursorEntity.positionY= Math.max(Math.min(cursorEntity.positionY+move.y, screen.height), 0);

            this.cursorRepository.save(cursorEntity);

            return {req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
        }else{
            return {req:"move",x:0,y:0,id:-1}
        }
    }
}