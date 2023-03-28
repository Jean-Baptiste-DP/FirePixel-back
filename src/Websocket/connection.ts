const WebSocket = require("ws")

export class Connection {
    public screen: any = null;
    public nbPhone: number;
    public phones: any[];

    constructor(nbPhone){
       this.nbPhone = nbPhone;
       this.phones = new Array(nbPhone)
    }
    

    newScreen(wsScreen):void{
        this.screen = wsScreen;
    }

    getFreePhone():number[]{
        let freePhone = [];
        for(let i=0; i<this.nbPhone;i++){
            if(!this.phones[i] || !this.phones[i].readyState === WebSocket.OPEN){
                freePhone.push(i)
            }
        }
        return freePhone
    }

    disconnectPhone(index:number){
        this.phones[index] = null
    }

    newPhoneClient(client):{idCursor:number, changed:boolean}{
        var index = this.searchIndexFromClient(client)
        if(index == -1){
            const freeSpace = this.getFreePhone()
            if(freeSpace.length>0){
                index = freeSpace[Math.floor(Math.random()*freeSpace.length)]
                this.phones[index]=client
                return {idCursor: index, changed: true}
            }else{
                console.log("No more free space for new phone")
            }
        }
        return {idCursor: index, changed:false}
    }

    searchIndexFromClient(client):number{
        let index=-1
        for(let i=0; i<this.nbPhone; i++){
            if(this.phones[i]==client){
                index=i
            }
        }
        return index
    }
}