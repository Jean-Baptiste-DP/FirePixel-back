import { AppDataSource } from "./data-source"
import { Cursor } from "./entity/Cursor"
import { NewPixel } from "./entity/NewPixel"
import { Screen } from "./entity/Screen"
import { CursorService } from "./service/cursor-service"
import { ScreenService } from "./service/screen-service"
import { Connection } from "./Websocket/connection"

AppDataSource.initialize().then(async () => {

    // Websocket storage

    const WsConnection = new Connection(16)

    // Repositories
    const ScreenRepository = AppDataSource.getRepository(Screen)
    const CursorRepository = AppDataSource.getRepository(Cursor)
    const PixelRepository = AppDataSource.getRepository(NewPixel)

    // Services
    const screenService = new ScreenService(ScreenRepository);
    const cursorService = new CursorService(CursorRepository, ScreenRepository)

    screenService.create({height:10,width:15, ip:"127.0.0.1"})

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(NewPixel)
    // console.log("Loaded users: ", users)

    // console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
