import { Repository } from "typeorm";
import { CreateCursorDTO, ModifCursorDTO } from "../dto/cursorDto";
import { MoveRequest } from "../dto/requestDto";
import { Cursor } from "../entity/Cursor";
import { Screen } from "../entity/Screen";

export class CursorService{
    constructor(
        private cursorRepository: Repository<Cursor>,
        private screenRepository: Repository<Screen>
    ){}

    async create(cursor: CreateCursorDTO): Promise<MoveRequest> {

        if(cursor.changed){
            const screen = await this.screenRepository.findOneBy({id:cursor.idScreen})

            if(screen){
                const cursorEntity: Cursor = new Cursor();
                cursorEntity.screen = screen;

                cursorEntity.ip = cursor.ip;
                cursorEntity.positionX = Math.floor(Math.random() * screen.width);
                cursorEntity.positionY = Math.floor(Math.random() * screen.height);
                cursorEntity.idCursor = cursor.idCursor
            
                await this.cursorRepository.save(cursorEntity);

                return {req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
            }
            return {req:"move",x:0,y:0,id:-1}
        }else{
            const cursorEntity = await this.cursorRepository.findOne(
                {
                    where:{
                        screen: {
                            id: cursor.idScreen
                        },
                        idCursor: cursor.idCursor
                    },
                    order:{
                        firstConnection:"DESC"
                    }
                }
            )
            if(cursorEntity){
                return{req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
            }
            else{
                return {req:"move",x:0,y:0,id:-1}
            }
        }
    }

    async move(cursor: ModifCursorDTO, move: MoveRequest):Promise<MoveRequest>{
        const cursorEntity = await this.cursorRepository.findOne(
            {
                where:{
                    screen: {
                        id: cursor.idScreen
                    },
                    idCursor: cursor.idCursor
                },
                order:{
                    firstConnection:"DESC"
                }
            }
        )

        if(cursorEntity){
            cursorEntity.positionX= Math.max(Math.min(cursorEntity.positionX+move.x, 100), 0);
            cursorEntity.positionY= Math.max(Math.min(cursorEntity.positionY+move.y, 100), 0);

            await this.cursorRepository.save(cursorEntity);

            return {req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
        }else{
            return {req:"move",x:0,y:0,id:-1}
        }
    }

    
}