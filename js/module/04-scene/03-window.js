var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Window=function(){this.initialize.apply(this,arguments)}
    _.Window.prototype = Object.create(_.Vessel.prototype)
    _.Window.prototype.constructor = _.Window;
    _.Window.prototype.initialize = function (origin,name,com) {
        _.Vessel.prototype.initialize.call(this,origin,name,com);
    }

    _.Window.prototype.shiftMode=function(){
        this._anime={}
        _.Vessel.prototype.shiftMode.call(this);
        if(!this.isRun(1)) this.setRun(1,true)
        if(!this.isRun(2)) this.setRun(2,true)
    }
    _.Window.prototype.refresh=function () {
        _.Vessel.prototype.refresh.call(this);
        if(this.isRun(1)) this.drawBack()
        if(this.isRun(2)) this.drawText()
        this.updateAnime()
    }
    _.Window.prototype.location=function(){
        _.Vessel.prototype.location.call(this);
    }
    _.Window.prototype.setAnime =function (type,data){
        if(this._anime[type]) this._anime[type].push(data)
        else  this._anime[type]=[data]
    }
    _.Window.prototype.drawBack = function() {
        if(this.isRun(1)) this.setRun(1,false)
        
        if(this._data.image && this._data.size) {
            let bit = this._origin.getBit(this._data.image.bit)
            let imageData = this._data.image
            let sizeData = this._data.size
            let that=this
            bit.addLoadListener(function () {
                let w = (imageData.x2 - imageData.x1) + (imageData.x3 - imageData.x2) * sizeData[0] + (imageData.x4 - imageData.x3)
                let h = (imageData.y2 - imageData.y1) + (imageData.y3 - imageData.y2) * sizeData[1] + (imageData.y4 - imageData.y3)
                that._data.w=w
                that._data.h=h
                this.width = w
                this.height = h
                this.bitmap = new Bitmap(w, h)
                this.bit(bit, this.bitmap, imageData, sizeData)
            }.bind(this))
        }
        else{
            this.bitmap = new Bitmap(this._data.w, this._data.h)
            if(this._data.darw) this.drawBrush(this.bitmap,this._data.darw)
            
        }
    }
    _.Window.prototype.drawText = function() {
        if(this.isRun(2)) this.setRun(2,false)
        this.cleanDraw(1)
        let padding0 = this._data.padding[0]
        let padding1 = this._data.padding[1]
        if(this._data.text)
            for(let item of this._data.text) {
                    let content=this._origin.getText(item.id)
                    if(content) {
                        let sp = new Sprite(this.getTextBit(content[0],content[1],1))
                        sp.x = item.x + padding0
                        sp.y = item.y + padding1
                        sp.type = 1
                        this.addChild(sp)
                    }
                }
    }
    _.Window.prototype.getTextBit=function (content,item,index){
         let bitmap = new Bitmap(0,0);
         bitmap.fontSize = item.fontSize;
         bitmap.fontFace = 'GameFont';
         bitmap.outlineWidth = item.outlineWidth;
         bitmap.fontItalic = item.fontItalic;
         if(item.anime){
             let t=parseInt(this._time/item.anime)
             bitmap.textColor=item.textColor[t%item.textColor.length]
             bitmap.outlineColor = item.outlineColor[t%item.outlineColor.length];
             this.setAnime(index,[bitmap,item,content])
         }
         else {
             bitmap.textColor=item.textColor[0]
             bitmap.outlineColor = item.outlineColor[0];   
         }
         let width=bitmap.measureTextWidth(content)
         bitmap._createCanvas(width,item.fontSize)
         bitmap.drawText(content, 0, 0, width,item.fontSize,'center')
         return  bitmap;
    }
    
    _.Window.prototype.updateAnime=function (){
        for(let key in this._anime){
           for(let index in this._anime[key]){
               let bitmap=this._anime[key][index][0]
               let item=this._anime[key][index][1]
               if(this._time%item.anime==0) {
                   let content = this._anime[key][index][2]
                   let t = parseInt(this._time / item.anime)
                   bitmap.clear()
                   bitmap.textColor = item.textColor[t % item.textColor.length]
                   bitmap.outlineColor = item.outlineColor[t % item.outlineColor.length];
                   let width = bitmap.measureTextWidth(content)
                   bitmap.drawText(content, 0, 0, width, item.fontSize, 'center')
               }
           }
        }
    }
    _.Window.prototype.drawBrush=function (bitmap,com){
        if(com)
          for(let item of com){
            let b=item.split(":")
            switch (b[0]){
                case "FA":
                    if(b.length===2)
                    bitmap.fillAll(b[1]);break
                case "FR":
                    if(b.length===6)
                    bitmap.fillRect(b[1],b[2],b[3],b[4],b[5]);break
                case "CR":
                    if(b.length===5)
                    bitmap.clearRect(b[1],b[2],b[3],b[4]);break
                case "CC":
                    if(b.length===5)
                    bitmap.drawCircle(b[1],b[2],b[3],b[4]);break
                case "GF":
                    if(b.length===8)
                    bitmap.gradientFillRect(parseInt(b[1]),parseInt(b[2]),parseInt(b[3]),parseInt(b[4]),b[5],b[6],b[7]==1?true:false)
            }  
         }
    }
    _.Window.prototype.cleanDraw=function (type) {
        for(let i=0;i<this.children.length;i++){
            if(this.children[i].type==type) {
                this.children.splice(i, 1)
                i--
            }
        }
        delete this._anime[type]
    }
})(LIM.SCENE);