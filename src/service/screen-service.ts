import { Repository } from "typeorm";
import { ScreenDTO } from "../dto/screenDto";
import { Screen } from "../entity/Screen";

export class ScreenService{
    constructor(
        private repository: Repository<Screen>
    ){}

    async create(screen: ScreenDTO): Promise<number> {
        // * à changer si plusieurs écrans
        const previouScreen = await this.repository.find({
            order:{
                id:"DESC"
            },
            take:1
        })[0]

        if(!previouScreen){
            const screenEntity: Screen = new Screen();
            screenEntity.height = screen.height;
            screenEntity.width = screen.width;
            screenEntity.ip = screen.ip;
        
            screenEntity.grid = new Array(screen.height)
            for(let i=0; i<screen.height; i++){
                screenEntity.grid[i] = new Array(screen.width + 1).join( 'f' ); // 'f' = 15 the white color
            }
        
            await this.repository.save(screenEntity);
            return screenEntity.id
        }
        return previouScreen.id
      }
}