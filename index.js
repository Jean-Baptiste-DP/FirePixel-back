const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const fs = require('fs');
require('dotenv').config()

const wss = new WebSocket.Server({ server: server });

var number = 0
var screen;

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(string) {

        let data = JSON.parse(string)
        console.log(data)

        if(data.type && data.type=="screen"){
            screen = ws;
            console.log("Screen connected")
        }
        else if(data.x){
            if(screen){
                screen.send(JSON.stringify(data))
            }
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