var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Window=function(){this.initialize.apply(this,arguments)}
    _.Window.prototype = Object.create(_.Vessel.prototype)
    _.Window.prototype.constructor = _.Window;
    _.Window.prototype.initialize = function (origin,com) {
        _.Vessel.prototype.initialize.call(this,origin,com);
    }

    //换挡
    _.Window.prototype.shiftMode=function(){
        _.Vessel.prototype.shiftMode.call(this);
        if(this._origin._run%2!=0) this._com.run*=2
    }
    //绘制
    _.Window.prototype.draw=function(){
        if(this._data.cutImage&&this._data.size) {
            console.log(this._data.size)
            let bit = this._origin.getBit(this._data.cutImage.bit)
            bit.addLoadListener(function () {
                let w = (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * this._data.size[0] + (this._data.cutImage.x4 - this._data.cutImage.x3)
                let h = (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * this._data.size[1] + (this._data.cutImage.y4 - this._data.cutImage.y3)
                this.bitmap = new Bitmap(w, h)
                for (let y = 0; y < this._data.size[1] + 2; y++)
                    for (let x = 0; x < this._data.size[0] + 2; x++)
                        if (y === 0) {
                            if (x === 0)
                                this.bitmap.blt(bit, this._data.cutImage.x1, this._data.cutImage.y1, this._data.cutImage.x2 - this._data.cutImage.x1, this._data.cutImage.y2 - this._data.cutImage.y1, 0, 0);
                            else if (x === this._data.size[0] + 1)
                                this.bitmap.blt(bit, this._data.cutImage.x3, this._data.cutImage.y1, this._data.cutImage.x4 - this._data.cutImage.x3, this._data.cutImage.y2 - this._data.cutImage.y1, (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * (x - 1), 0);
                            else
                                this.bitmap.blt(bit, this._data.cutImage.x2, this._data.cutImage.y1, this._data.cutImage.x3 - this._data.cutImage.x2, this._data.cutImage.y2 - this._data.cutImage.y1, (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * (x - 1), 0);
                        } else if (y === this._data.size[1] + 1) {
                            if (x === 0)
                                this.bitmap.blt(bit, this._data.cutImage.x1, this._data.cutImage.y3, this._data.cutImage.x2 - this._data.cutImage.x1, this._data.cutImage.y4 - this._data.cutImage.y3, 0, (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * (y - 1));
                            else if (x === this._data.size[0] + 1)
                                this.bitmap.blt(bit, this._data.cutImage.x3, this._data.cutImage.y3, this._data.cutImage.x4 - this._data.cutImage.x3, this._data.cutImage.y4 - this._data.cutImage.y3, (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * (x - 1), (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * (y - 1));
                            else
                                this.bitmap.blt(bit, this._data.cutImage.x2, this._data.cutImage.y3, this._data.cutImage.x3 - this._data.cutImage.x2, this._data.cutImage.y4 - this._data.cutImage.y3, (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * (x - 1), (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * (y - 1));
                        }
                        else {
                            if (x === 0)
                                this.bitmap.blt(bit, this._data.cutImage.x1, this._data.cutImage.y2, this._data.cutImage.x2 - this._data.cutImage.x1, this._data.cutImage.y3 - this._data.cutImage.y2, 0, (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * (y - 1));
                            else if (x === this._data.size[0] + 1)
                                this.bitmap.blt(bit, this._data.cutImage.x3, this._data.cutImage.y2, this._data.cutImage.x4 - this._data.cutImage.x3, this._data.cutImage.y3 - this._data.cutImage.y2, (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * (x - 1), (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * (y - 1));
                            else
                                this.bitmap.blt(bit, this._data.cutImage.x2, this._data.cutImage.y2, this._data.cutImage.x3 - this._data.cutImage.x2, this._data.cutImage.y3 - this._data.cutImage.y2, (this._data.cutImage.x2 - this._data.cutImage.x1) + (this._data.cutImage.x3 - this._data.cutImage.x2) * (x - 1), (this._data.cutImage.y2 - this._data.cutImage.y1) + (this._data.cutImage.y3 - this._data.cutImage.y2) * (y - 1));

                        }
            }.bind(this));
        }
        else this.bitmap = new Bitmap(this._data.w,this._data.h)
    }
    //刷新
    _.Window.prototype.refresh=function () {
        _.Vessel.prototype.refresh.call(this);
        if(this._com.run%2===0) this.draw()
    }
})(LIM.SCENE);