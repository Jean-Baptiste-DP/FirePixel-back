import { Repository } from "typeorm";
import { ScreenObj } from "../dto/screenDto";
import { Screen } from "../entity/Screen";

export class DRepoScreen{
    
    constructor(
        private screenRepository : Repository<Screen>,
    ){}

    public screenEntity : Screen ={
            id:-1,
            height: 0,
            width: 0,
            ip: "",
            lastPixel: 0,
            grid: [],
            pixels: [],
            cursors: []
        };

    async findOne(): Promise<Screen>{
        if(this.screenEntity.id<0){
            let screen = (await this.screenRepository.find())[0]
            if(screen){
                this.screenEntity = screen;
            }
            return screen
        }

        return this.screenEntity
    }

    async save(screen : Screen):Promise<void>{
        if(screen){
            this.screenEntity = screen
            this.screenRepository.save(this.screenEntity)
        }
    }

    async saveInDB(): Promise<void>{
        if(this.screenEntity.id>=0){
            console.log("Save screen")
            this.screenRepository.save(this.screenEntity)
        }else{
            console.log("No screen to save")
        }
    }
}