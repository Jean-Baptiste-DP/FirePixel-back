const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const fs = require('fs');
import Connexion from './connexion'
require('dotenv').config()

const wss = new WebSocket.Server({ server: server });

var number = 0
var screen;
const connexion = new Connexion(["red", "yellow", "blue", "green"])

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(string) {

        let data = JSON.parse(string)

        if(data.req && data.req=="connection" && data.type){
            // screen = ws;
            // console.log("Screen connected")
            if(data.type=="screen"){
                connexion.newScreen(ws)
            }else{
                res = connexion.newPhoneClient(ws)
                if(res.id==-1){
                    ws.send(JSON.stringify(res))
                }else if(connexion.screen){
                    ws.send(JSON.stringify(res))
                    connexion.screen.send(JSON.stringify(res))
                }else{
                    ws.send(JSON.stringify(res))
                }
            }
        }
        else if(data.req && data.req=="move" && data.x && data.y){
            res = connexion.moveClient(ws,data)
            if(res){
                ws.send(JSON.stringify(res))
                if(connexion.screen){
                    connexion.screen.send(JSON.stringify(res))
                }
            }
        }
        else if(data.req && data.req=="chgColor" && data.color){
            res = connexion.changeColorClient(ws,data)
            if(res){
                for(let i=0;i<connexion.nbPhones;i++){
                    if(connexion.phones[i].client.readyState === WebSocket.OPEN){
                        connexion.phones[i].client.send(JSON.stringify(res))
                    }
                }
                if(connexion.screen){
                    connexion.screen.send(JSON.stringify(res))
                }
            }
        }
        else{
            console.log("Error in websocket : ")
            console.log(data)
        }
    });
});

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    fichier = fs.readFileSync("./index.html", {encoding:'utf8'})
    res.end(fichier);
})

app.get('/number', (req,res)=>{
    res.end(number.toString())
})


server.listen(process.env.PORT, () => console.log(`Lisening on port :`+process.env.PORT))