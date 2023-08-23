var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=>{
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
    
    _.Window.prototype.drawBack = function() {
        if(this.isRun(1)) this.setRun(1,false)
        if(this._data.image&& this._data.image.bit && this._data.size) {
            let bit = this._origin.getBit(this._data.image.bit)
            let imageData = this._data.image
            let sizeData = this._data.size
            let that=this
            bit.addLoadListener(function () {
                let w = (imageData.x2 - imageData.x1) + 
                    (imageData.x3 - imageData.x2) * sizeData[0] +
                    (imageData.x4 - imageData.x3)
                let h = (imageData.y2 - imageData.y1) + 
                    (imageData.y3 - imageData.y2) * sizeData[1] + 
                    (imageData.y4 - imageData.y3)
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
                        if(item.arrange) content[0]=content[0].substring(item.arrange[0],item.arrange[1])
                        let sp = new Sprite(this.getTextBit(content[0],content[1],1))
                        sp.x = LIM.UTILS.lengthNum(item.x) + padding0
                        sp.y =  LIM.UTILS.lengthNum(item.y) + padding1
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
         let w= bitmap.measureTextWidth(item.layout?'因'.repeat(item.layout):content)
         let h = (item.layout?parseInt(content.length/item.layout+0.5):1)*item.fontSize
         bitmap._createCanvas(w,h)
        if(item.layout){
            for(let i=0;i*item.layout<content.length;i++)
                bitmap.drawText(content.substring(i,i+item.layout), 0, i*item.fontSize, w, item.fontSize, 'center')
        }
        else bitmap.drawText(content, 0, 0, w,h,'center')
         return  bitmap;
    }
    
    _.Window.prototype.setAnime =function (type,data){
        if(this._anime[type]) this._anime[type].push(data)
        else  this._anime[type]=[data]
    }
    _.Window.prototype.updateAnime=function (){
        if(this._time%2>0)return
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
                   let w= bitmap.measureTextWidth(item.layout?'因'.repeat(item.layout):content)
                   let h = (item.layout?parseInt(content.length/item.layout+0.5):1)*item.fontSize
                   if(item.layout){
                       for(let i=0;i*item.layout<content.length;i++)
                           bitmap.drawText(content.substring(i,i+item.layout), 0, i*item.fontSize, w, item.fontSize, 'center')
                       
                   }
                   else 
                   bitmap.drawText(content, 0, 0, w, h, 'center')
               }
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