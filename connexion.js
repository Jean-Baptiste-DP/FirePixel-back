const WebSocket = require('ws');

class PhoneClient{
    constructor(id, height, width){
        this.client;
        this.x = (width-(width%2))/2
        this.y = (height-(height%2))/2
        this.id = id
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

class PhoneConnexion{
    constructor(number, height, width, screen){
        this.screen = screen;
        this.nbPhones = number;
        this.phones = new Array(this.nbPhones);
        for(let i=0;i<this.nbPhones;i++){
            this.phones[i] = new PhoneClient(i, height, width)
        }
    }

    isStillConnected(){
        return !!this.screen && this.screen.readyState === WebSocket.OPEN
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

class ScreenConnexion{
    constructor(ScreenNumber, PhoneNumber){
        this.ScreenNumber = ScreenNumber;
        this.PhoneNumber = PhoneNumber;
        this.allConnexion = new Array(ScreenNumber);
        for(let i=0; i<ScreenNumber; i++){
            this.allConnexion = new PhoneConnexion(PhoneNumber, 0, 0, undefined)
        }
    }

    newConfiguration(id, height, width){
        if(!this.allConnexion[id].isStillConnected()){
            this.allConnexion[id] = new PhoneConnexion(this.PhoneNumber, height, width)
        }
    }

    newScreen(id, screen){
        this.allConnexion[id].newScreen(screen)
    }

    newScreenClient(screen, data){
        if(this.searchIndexFromScreen(screen)==-1){
            let freeSpace = this.getFreeScreen()
            if(freeSpace.length>0 && data.height && data.width){
                let index = freeSpace[0]
                this.allConnexion[index] = new PhoneConnexion(this.PhoneNumber, data.height, data.width, screen)
                return {req: "giveId", id:index}
            }else{
                return {req:"giveId",id:-1}
            }
        }else{
            return {req:"giveId", id:this.searchIndexFromScreen(screen)}
        }
    }

    newPhoneClient(id, client){
        return this.allConnexion[id].newPhoneClient(client)
    }

    moveClient(id, client, data){
        return this.allConnexion[id].moveClient(client, data)
    }

    changeColorClient(id, client, data){
        return this.allConnexion[id].changeColorClient(client, data)
    }

    searchIndexFromScreen(screen){
        let index=-1
        for(let i=0; i<this.ScreenNumber;i++){
            if(this.allConnexion[i].screen==screen){
                index=i
            }
        }
        return index
    }

    getFreeScreen(){
        let freeScreen = [];
        for(let i=0;i<this.ScreenNumber;i++){
            if(!this.allConnexion[i].isStillConnected()){
                freeScreen.push(i)
            }
        }
        return freeScreen
    }
}

module.exports = PhoneConnexion