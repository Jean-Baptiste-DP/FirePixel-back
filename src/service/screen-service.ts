import { ScreenDTO } from "../dto/screenDto";
import { ChgColorRequest } from "../dto/requestDto";
import { Screen } from "../entity/Screen";
import { DRepoScreen } from "../DynamicRepo/DRepoScreen";

export class ScreenService{
    constructor(
        private repository: DRepoScreen
    ){}

    async create(screen: ScreenDTO): Promise<number> {
        // * à changer si plusieurs écrans
        const previouScreen = await this.repository.findOne();

        if(!previouScreen){
            console.log("Didn't find screen")
            const screenEntity: Screen = new Screen();
            screenEntity.height = screen.height;
            screenEntity.width = screen.width;
            screenEntity.ip = screen.ip;
        
            screenEntity.grid = new Array(screen.height)
            for(let i=0; i<screen.height; i++){
                screenEntity.grid[i] = new Array(screen.width + 1).join( 'f' ); // 'f' = 15 the white color
            }
            this.repository.save(screenEntity);
            return screenEntity.id
        }else if(previouScreen.height!=screen.height || previouScreen.width!=screen.width){
            for(let i=0; i<screen.height; i++){
                if(i>=previouScreen.grid.length){
                    previouScreen.grid[i] = new Array(screen.width + 1).join( 'f' );
                }else if(screen.width>previouScreen.grid[i].length){
                    previouScreen.grid[i] = previouScreen.grid[i] + new Array(screen.width - previouScreen.width + 1).join('f');
                }
            }
            previouScreen.height = screen.height;
            previouScreen.width = screen.width;
        }
        return previouScreen.id;
    }
    
    async getScreen():Promise<number[][]>{ //* prendre id pour plusieurs écrans
        const storedScreen = await this.repository.findOne()

        if(storedScreen){
            let screen : number[][]= new Array(storedScreen.height);
            for(let i=0; i<storedScreen.height; i++){
                screen[i] = new Array(storedScreen.width);
                for(let j=0; j<storedScreen.width; j++){
                    screen[i][j] = parseInt(storedScreen.grid[i][j], 16);
                }
            }
            return screen;
        }else{
            console.log("no screen")
            return [[]];
        }
    }

    async changeScreen(requete : ChgColorRequest):Promise<void>{
        const storedScreen = await this.repository.findOne()

        if(storedScreen){
            storedScreen.grid[requete.y] = storedScreen.grid[requete.y].substring(0, requete.x) + requete.color.toString(16) + storedScreen.grid[requete.y].substring(requete.x + 1);
        }else{
            console.log("no screen")
        }
    }
}