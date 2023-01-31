import { AppDataSource } from "./data-source"
import { Cursor } from "./entity/Cursor"
import { NewPixel } from "./entity/NewPixel"
import { Screen } from "./entity/Screen"
import { CursorService } from "./service/cursor-service"
import { NewPixelService } from "./service/newPixel-service"
import { ScreenService } from "./service/screen-service"
import { Connection } from "./Websocket/connection"

const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server });

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
    const pixelService = new NewPixelService(CursorRepository, PixelRepository)

    // Websocket call

    wss.on('connection', function connection(ws) {

        ws.on('message', async function incoming(string:string) {
    
            let data = JSON.parse(string);
            let response;

            if(data.req && data.req=="connection" && data.type){
                if(data.type=="screen"){
                    console.log("New screen")
                    WsConnection.newScreen(ws)
                    screenService.create({height:100,width:100, ip:"127.0.0.1"})
                }else{
                    console.log("New phone")
                    const index = WsConnection.newPhoneClient(ws)
                    response = await cursorService.create({idScreen:1, ip:"127.0.0.1", ...index})
                }
            }else if(data.req && data.req=="move" && data.x!=undefined && data.y!=undefined){
                const index = WsConnection.searchIndexFromClient(ws)
                response = await cursorService.move({idScreen:1, idCursor: index},data)
            }else if(data.req && data.req=="chgColor" && data.color!=undefined){
                const index = WsConnection.searchIndexFromClient(ws)
                response = await pixelService.create({idScreen:1, idCursor: index}, data)
            }else{
                console.log("Error in websocket : ")
                console.log(data)
            }

            if(response && response.req && response.req=="move" && response.id!=-1){
                ws.send(JSON.stringify(response))
                if(WsConnection.screen){
                    WsConnection.screen.send(JSON.stringify(response))
                }
            }
            else if(response && response.req && response.req=="chgColor" && response.color!=-1){
                if(WsConnection.screen){
                    WsConnection.screen.send(JSON.stringify(response))
                }
                for(let i=0; i<WsConnection.nbPhone; i++){
                    if(WsConnection.phones[i] && WsConnection.phones[i].readyState==WebSocket.OPEN){
                        WsConnection.phones[i].send(JSON.stringify(response))
                    }
                }
            }else{
                console.log("Wrong response")
                console.log(response)
            }
        });
    });

    server.listen(process.env.PORT, () => console.log(`Lisening on port :`+process.env.PORT))

}).catch(error => console.log(error))
