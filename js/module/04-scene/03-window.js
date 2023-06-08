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
        _.Vessel.prototype.shiftMode.call(this);
        if(!this.isRun(1)) this.setRun(1,true)
        if(!this.isRun(2)) this.setRun(2,true)
    }
    _.Window.prototype.refresh=function () {
        _.Vessel.prototype.refresh.call(this);
        if(this.isRun(1)) this.drawBack()
        if(this.isRun(2)) this.drawText()
        if(this.isRun(4)) this.updateMask()
    }
    _.Window.prototype.location=function(){
        _.Vessel.prototype.location.call(this);
    }

    _.Window.prototype.drawBack = function() {
        if(this.isRun(1)) this.setRun(1,false)

 // "size":[24,32],
 // "image": {"bit":"ver","x1":291,"x2":311,"x3":331,"x4":351,"y1":268,"y2":288,"y3":308,"y4":328},
        if(this._data.image && this._data.size) {
            let bit = this._origin.getBit(this._data.image.bit)
            let imageData = this._data.image
            let sizeData = this._data.size
            bit.addLoadListener(function () {
                let w = (imageData.x2 - imageData.x1) + (imageData.x3 - imageData.x2) * sizeData[0] + (imageData.x4 - imageData.x3)
                let h = (imageData.y2 - imageData.y1) + (imageData.y3 - imageData.y2) * sizeData[1] + (imageData.y4 - imageData.y3)
                this.width = w
                this.height = h
                this.bitmap = new Bitmap(w, h)
                this.bit(bit, this.bitmap, imageData, sizeData)
                this.drawMask()
            }.bind(this))
        }
        else this.bitmap = new Bitmap(this._data.w, this._data.h)
    }
    _.Window.prototype.drawText = function() {
        if(this.isRun(2)) this.setRun(2,false)
        this.cleanDraw(1)
        let padding0 = this._data.padding[0]
        let padding1 = this._data.padding[1]
        if(this._data.text)
            for(let item of this._data.text)
                if(this._origin._text[item.id]) {
                    let sp = new Sprite(this._origin._text[item.id])
                    sp.x = item.x + padding0
                    sp.y = item.y + padding1
                    sp.type = 1
                    this.fillMask(sp)
                    this.addChild(sp)
                }
    }
    _.Window.prototype.drawMask = function() {
        this.mask = new PIXI.Graphics()
        this.mask.beginFill(0xffffff)
        this.mask.drawRect(
            this.getX(),
            this.getY(),
            this.width,
            this.height)
        this.mask.endFill()
    }
    _.Window.prototype.fillMask = function(sp) {
        sp.mask = new PIXI.Graphics();
        sp.mask.beginFill(0xffffff);
        let x = this.getX() + sp.x;
        let y = this.getY() + sp.y;
        let w = Math.min(sp.width, this.width - this._data.padding[0] - sp.x);
        let h = Math.min(sp.height, this.height - this._data.padding[1] - sp.y);
        sp.mask.drawRect(x, y, w, h);
        sp.mask.endFill();
    }
    _.Window.prototype.updateMask = function() {
        if(this.isRun(4)) this.setRun(4,false);
        this.drawMask();
        let children = this.children;
        let len = children.length;
        for(let i = 0; i < len; i++) {
            if(children[i].type) this.fillMask(children[i]);
        }
    }

    _.Window.prototype.cleanDraw=function (type) {
        for(let i=0;i<this.children.length;i++){
            if(this.children[i].type==type) {
                this.children.splice(i, 1)
                i--
            }
        }
    }
})(LIM.SCENE);