const WebSocket = require('ws');

const gridHeight = 100;
const gridWidth = 100;

class PhoneClient{
    constructor(id){
        this.client;
        this.x = (gridWidth-(gridWidth%2))/2
        this.y = (gridHeight-(gridHeight%2))/2
        this.id=id
    }

    isConnected(){
        if(this.client){
            return this.client.readyState === WebSocket.OPEN
        }
        return false
    }

    changeClient(client){
        if(this.isConnected()){
            return {req:"move",x:0,y:0,id:-1}
        }else{
            this.client = client
            return {req:"move",x:this.x,y:this.y,id:this.id}
        }
    }

    moveCursor(data){
        this.x = Math.max(0, Math.min(gridWidth-1, this.x + data.x))
        this.y = Math.max(0, Math.min(gridHeight-1, this.y + data.y))

        return {req:"move",x:this.x,y:this.y,id:this.id}
        
    }

    moveCursorNull(){

        return {req:"move",x:Math.round(this.x),y:Math.round(this.y),id:this.id}

    }

    changeColor(data){
        return {req:"chgColor", x:this.x, y:this.y, color:data.color}
    }
}

class Connexion{
    constructor(number){
        this.screen;
        this.nbPhones = number;
        this.phones = new Array(this.nbPhones);
        for(let i=0;i<this.nbPhones;i++){
            this.phones[i] = new PhoneClient(i)
        }
    }

    newScreen(screen){
        if(!this.screen || !this.screen.readyState === WebSocket.OPEN){
            this.screen=screen
        }
    }

    getFreePhone(){
        let freePhone = [];
        for(let i=0;i<this.nbPhones;i++){
            if(!this.phones[i].isConnected()){
                freePhone.push(i)
            }
        }
        return freePhone
    }

    newPhoneClient(client){
        if(this.searchIndexFromClient(client)==-1){
            let freeSpace = this.getFreePhone()
            if(freeSpace.length>0){
                return this.phones[freeSpace[Math.floor(Math.random()*freeSpace.length)]].changeClient(client)
            }
            return {req:"move",x:0,y:0,id:-1}
        }else{
            return this.phones[this.searchIndexFromClient(client)].moveCursorNull()
        }
    }

    searchIndexFromClient(client){
        let index=-1
        for(let i=0; i<this.nbPhones;i++){
            if(this.phones[i].client==client){
                index=i
            }
        }
        return index
    }

    moveClient(client, data){
        const idClient = this.searchIndexFromClient(client)
        if(idClient!=-1){
            return this.phones[idClient].moveCursor(data)
        }
        else{
            return null
        }
    }

    changeColorClient(client, data){
        const idClient = this.searchIndexFromClient(client)
        if(idClient!=-1){
            return this.phones[idClient].changeColor(data)
        }
        else{
            return null
        }
    }
}

module.exports = Connexion