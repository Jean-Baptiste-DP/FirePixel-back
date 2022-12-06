const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ server: server });

var number = 0

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(new_number) {
        console.log('new value: %s', new_number);

        number = parseInt(new_number)

        wss.clients.forEach(function each(client) {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {
            //     client.send(new_number);
            // }
            if (client.readyState === WebSocket.OPEN) {
                client.send(number.toString());
            }
        });

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


server.listen(10406, () => console.log(`Lisening on port :10406`))