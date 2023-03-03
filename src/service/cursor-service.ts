import { Repository } from "typeorm";
import { CreateCursorDTO, ModifCursorDTO } from "../dto/cursorDto";
import { MoveRequest } from "../dto/requestDto";
import { DRepoScreen } from "../DynamicRepo/DRepoScreen";
import { Cursor } from "../entity/Cursor";
import { Screen } from "../entity/Screen";

export class CursorService{
    constructor(
        private cursorRepository: Repository<Cursor>,
        private screenRepository: DRepoScreen
    ){}

    async create(cursor: CreateCursorDTO): Promise<MoveRequest> {

        if(cursor.changed){
            const screen = await this.screenRepository.findOne()

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
            console.log("Aucun écran trouvé")
            return {req:"move",x:0,y:0,id:-1}
        }else{
            const cursorEntity = await this.cursorRepository.findOne(
                {
                    where:{ // * ajout de recherche par id sreen si plusieurs
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
                console.log("Aucun curseur trouvé")
                return {req:"move",x:0,y:0,id:-1}
            }
        }
    }

    async move(cursor: ModifCursorDTO, move: MoveRequest):Promise<MoveRequest>{
        const cursorEntity = await this.cursorRepository.findOne(
            {
                where:{// * ajout de recherche par id sreen si plusieurs
                    idCursor: cursor.idCursor
                },
                order:{
                    firstConnection:"DESC"
                }
            }
        )

        if(cursorEntity){
            cursorEntity.positionX= Math.max(Math.min(cursorEntity.positionX+move.x, 100), 0); // ! prendre en compte les dimensions de l'écran
            cursorEntity.positionY= Math.max(Math.min(cursorEntity.positionY+move.y, 100), 0);

            await this.cursorRepository.save(cursorEntity);

            return {req:"move", x:cursorEntity.positionX,y:cursorEntity.positionY,id:cursorEntity.idCursor}
        }else{
            return {req:"move",x:0,y:0,id:-1}
        }
    }

    
}