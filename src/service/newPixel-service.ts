import { Repository } from "typeorm";
import { ModifCursorDTO } from "../dto/cursorDto";
import { ChgColorRequest } from "../dto/requestDto";
import { Cursor } from "../entity/Cursor";
import { NewPixel } from "../entity/NewPixel";

export class NewPixelService{
    constructor(
        private cursorRepository: Repository<Cursor>,
        private pixelRepository: Repository<NewPixel>
    ){}

    async create(cursor: ModifCursorDTO, chgcolor: ChgColorRequest): Promise<ChgColorRequest> {

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
            const pixel: NewPixel = new NewPixel();

            pixel.positionX = cursorEntity.positionX;
            pixel.positionY = cursorEntity.positionY;
            pixel.color = chgcolor.color;
            pixel.previousColor = 0;
            // TODO prendre la vraie couleur précédente

            pixel.grid = cursorEntity.screen;
            pixel.cursor = cursorEntity;

            await this.pixelRepository.save(pixel);

            return {req: "chgColor", x: cursorEntity.positionX, y: cursorEntity.positionY, color: chgcolor.color}
        }
        return {req:"chgColor",x:0,y:0,color:-1}
    }

    
}