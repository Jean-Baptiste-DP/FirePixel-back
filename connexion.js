const WebSocket = require('ws');

const gridHeight = 100;
const gridWidth = 100;

class PhoneClient{
    constructor(color,id){
        this.client;
        this.color = color;
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
            return false
        }else{
            this.client = client
            this.x = (gridWidth-(gridWidth%2))/2
            this.y = (gridHeight-(gridHeight%2))/2
            return true
        }
    }

    moveCursor(data){
        this.x = Math.max(0, Math.min(gridWidth-1, this.x + data.x))
        this.y = Math.max(0, Math.min(gridHeight-1, this.y + data.y))
        return {req:"move",x:this.x,y:this.y,id:this.id}
    }
}

class Connexion{
    constructor(colors){
        this.screen;
        this.nbPhones = len(colors);
        this.phones = new Array(this.nbPhones);
        for(let i=0;i<this.nbPhones;i++){
            this.phones[i] = new PhoneClient(colors[i],i)
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

    newPhoneClient(client,index){
        return this.phones[index].changeClient(client)
    }
}