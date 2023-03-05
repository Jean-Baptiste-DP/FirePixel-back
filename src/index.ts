import { AppDataSource } from "./data-source"

import { Screen } from "./entity/Screen"

import { DRepoScreen } from "./DynamicRepo/DRepoScreen"
import { DRepoCursor } from "./DynamicRepo/DRepoCursor"

import { CursorService } from "./service/cursor-service"
import { NewPixelService } from "./service/newPixel-service"
import { ScreenService } from "./service/screen-service"

import { Connection } from "./Websocket/connection"

const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const validToken = "admin";
var cors = require('cors');

const wss = new WebSocket.Server({ server: server });
app.use(cors({
    origin: process.env.FRONT_URL
}));

AppDataSource.initialize().then(async () => {

    // Websocket storage

    const WsConnection = new Connection(16)

    // Repositories
    const ScreenRepository = AppDataSource.getRepository(Screen)

    //Dynamic Repositories
    const ScreenDynRepository = new DRepoScreen(ScreenRepository);
    const CursorDynRepository = new DRepoCursor();

    // Services
    const screenService = new ScreenService(ScreenDynRepository);
    const cursorService = new CursorService(CursorDynRepository, ScreenDynRepository)
    const pixelService = new NewPixelService(CursorDynRepository)

    // Regular save of Dynamic Repositories

    // const saveScreenDynRepo = setInterval(ScreenDynRepository.saveInDB, 10*60*1000);// save Screen every 10 minutes
    const saveScreenDynRepo = setInterval(async ()=>{ScreenDynRepository.saveInDB()}, 2*60*1000) // 2 min

    // Websocket call

    wss.on('connection', function connection(ws) {

        ws.on('message', async function incoming(string:string) {
    
            let data = JSON.parse(string);
            let response;

            // take request
            if(data?.req=="connection" && data.type){
                if(data.type=="screen" && data.token == validToken){
                    WsConnection.newScreen(ws)
                    response ={req:data.req, type:data.type, id: await screenService.create({height:data.height,width:data.width, ip:"127.0.0.1"})}
                    WsConnection.screen.send(JSON.stringify(response))
                }else if(data.type=="screen" && data.token != validToken){
                    response = { req: data.req, type:data.type, res: "Error : Invalid token", token : data.token}
                }else if (data.type =="phone"){
                    console.log("New phone")
                    const index = WsConnection.newPhoneClient(ws)
                    response =  await cursorService.create({idScreen:1, ip:"127.0.0.1", ...index})
                }
            }else if(data?.req=="move" && data.x!=undefined && data.y!=undefined){
                const index = WsConnection.searchIndexFromClient(ws)
                response = await cursorService.move({idScreen:1, idCursor: index},data)
            }else if(data?.req=="chgColor" && data.color!=undefined){
                const index = WsConnection.searchIndexFromClient(ws)
                response = await pixelService.create({idScreen:1, idCursor: index}, data)
                screenService.changeScreen(response);
            }else if(data?.req=="update" && data.id){
                response = {req : data.req, id : data.id}
            }
            else{
                console.log("Error in websocket : ")
                console.log(data)
            }


            // send response
            if(response?.req && response.req=="move" && response.id!=-1){
                ws.send(JSON.stringify(response))
                if(WsConnection.screen){
                    WsConnection.screen.send(JSON.stringify(response))
                }
            }
            else if(response?.req && response.req=="chgColor" && response.color!=-1){
                if(WsConnection.screen){
                    WsConnection.screen.send(JSON.stringify(response))
                }
                for(let i=0; i<WsConnection.nbPhone; i++){
                    if(WsConnection.phones[i] && WsConnection.phones[i].readyState==WebSocket.OPEN){
                        WsConnection.phones[i].send(JSON.stringify(response))
                    }
                }
            }
            else if(response?.req == "update" && response.id) {
                console.log("update sended by screen id " + response.id)
            }
            else if (response?.req == "connection" && response.type=="screen" && response.id) {
                console.log(" New Screen, id : ", response.id)
            }
            else if ( response?.req == "connection" && response.type == "screen" && response.res == "Error : Invalid token") {
                console.log(" Failed attemp to log screen , Invalid token: ", response.token)
            }
            else{
                console.log("Wrong response")
                console.log(response)
            }
        });
    });

    app.get('/grid', async (req, res) => {
        res.send(await screenService.getScreen());
      })

    server.listen(process.env.PORT, () => console.log(`Lisening on port :`+process.env.PORT))

}).catch(error => console.log(error))
