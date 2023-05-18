var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Command=function(){this.initialize.apply(this,arguments)}
    _.Command.prototype = Object.create(_.Window.prototype)
    _.Command.prototype.constructor = _.Command;
    _.Command.prototype.initialize = function (origin,name,com) {
        _.Window.prototype.initialize.call(this,origin,name,com);
        this._lastClickTime = 0;
        this._doubleThreshold = 300;
        this._list={}

    }
    _.Command.prototype.refresh = function () {
        _.Window.prototype.refresh.call(this);
        if(this.isRun(3)) this.drawOption()
        this.processWheel()
        this.processTouch()
    }

    _.Command.prototype.location=function(){
        _.Window.prototype.location.call(this);
        if(!this.isRun(3)) this.setRun(3,true)
    }

    _.Command.prototype.processWheel = function() {
        if(this.isOpe(1)){
            let threshold = 20;
            if (TouchInput.wheelY >= threshold) console.log("滚轮下");
            if (TouchInput.wheelY <= -threshold) console.log("滚轮上");
        }
    }
    _.Command.prototype.processTouch = function() {
        if(this.hasActions()==0&&this.isOpe(0)){
            const currentTime = performance.now();
            if (TouchInput.isTriggered() && this.isTouch()) {
                if (currentTime - this._lastClickTime < this._doubleThreshold)
                    console.log("左键双击");
                else console.log("左键");
                this._lastClickTime = currentTime;
            }
            else if (TouchInput.isCancelled()) console.log("右键");
        }
    }
    _.Command.prototype.drawOption = function() {
        if(this.isRun(3)) this.setRun(3,false)
        this.cleanDraw(2)
        let option = this._data.option
        if(option.item) {
            for(let key of Object.keys(option.item)) {
                let rect = this.itemRect(option,key)
                let listItem = this._list[key] = {mode: option.item[key].mode || 0}
                let bitData = this.getOptionData(option,key)
                let bit = this._origin.getBit(bitData.bit)
                bit.addLoadListener(function () {
                    let x2x1 = bitData.x2 - bitData.x1
                    let x3x2 = bitData.x3 - bitData.x2
                    let x4x3 = bitData.x4 - bitData.x3
                    let y2y1 = bitData.y2 - bitData.y1
                    let y3y2 = bitData.y3 - bitData.y2
                    let y4y3 = bitData.y4 - bitData.y3
                    let sizeX = rect.width - x2x1 - x4x3
                    let sizeY = rect.height - y2y1 - y4y3
                    if(sizeX < 0 || sizeY < 0) {
                        listItem.mode = -1
                    }
                    else {
                        let size0 = parseInt(sizeX / x3x2)
                        let size1 = parseInt(sizeY / y3y2)
                        let sw = size0 * x3x2 + x2x1 + x4x3
                        let sh = size1 * y3y2 + y2y1 + y4y3
                        if(rect.width > sw) {
                            rect.x += (rect.width - sw) / 2
                        }
                        if(rect.height > sh) {
                            rect.y += (rect.height - sh) / 2
                        }
                        let sp = listItem.sp = new Sprite(new Bitmap(sw,sh))
                        sp.type = 2
                        sp.x = rect.x
                        sp.y = rect.y
                        this.fillMask(sp)
                        this.addChild(sp)
                        this.bit(bit, sp.bitmap, bitData, [size0, size1])
                    }
                }.bind(this))
            }
        }
    }
    _.Command.prototype.isTouch=function () {
        return TouchInput.x>this.getX()&&
            TouchInput.x<this.getX()+this.width&&
            TouchInput.y>this.getY()&&
            TouchInput.y<this.getY()+this.height
    }
    _.Command.prototype.itemRect = function(option, index) {
        let rect = new Rectangle();
        switch (option.mode) {
            case 0:
                let h = this.height - this._data.padding[1] * 2;
                let w = this.width - this._data.padding[0] * 2;
                let cols = option.cols;
                let row = option.row;
                let margin0 = option.margin[0];
                let margin1 = option.margin[1];
                w /= cols;
                h /= row;
                w -= margin0 * 2;
                h -= margin1 * 2;
                rect.width = w;
                rect.height = h;
                let r = parseInt(index / cols);
                let c = index % cols;
                rect.x = this._data.padding[0] + (c * w) + ((c * 2 + 1) * margin0);
                rect.y = this._data.padding[1] + (r * h) + ((r * 2 + 1) * margin1);
        }
        return rect;
    }

    _.Command.prototype.getOptionData = function(option, key) {
        const keyItem = option.item[key];
        const keyItemUseUi = keyItem && keyItem.useUi;
        const optionUseUi = option.useUi;
        const isActivation = option.activation === key;
        const isSelect = option.select === key;
        const isDisable = option.disable.indexOf(key) > -1;

        if (isActivation) return (keyItemUseUi && keyItemUseUi.act) || (optionUseUi && optionUseUi.act) || null;
        if (isSelect) {
            if (isDisable) return (keyItemUseUi && keyItemUseUi.dse) || (optionUseUi && optionUseUi.dse) || null;
            return (keyItemUseUi && keyItemUseUi.sel) || (optionUseUi && optionUseUi.sel) || null;
        }
        if (isDisable) return (keyItemUseUi && keyItemUseUi.dis) || (optionUseUi && optionUseUi.dis) || null;
        return (keyItemUseUi && keyItemUseUi.vis) || (optionUseUi && optionUseUi.vis) || null;
    };
    
})(LIM.SCENE);