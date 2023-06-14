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
        this._interval = [0,0];
        this._list={}
        this._arrow={}
        this._cursor={}
        this._option={}

    }
    _.Command.prototype.update = function () {
        _.Window.prototype.update.call(this);
        if(this._interval[0]>0) this._interval[0]--
        if(this._interval[1]>0) this._interval[1]--
    }
    
    _.Command.prototype.refresh = function () {
        _.Window.prototype.refresh.call(this);
        if(this.isRun(3)) this.drawOption(this._data.option)
        this.drawArrow()
        this.drawCursor()
        this.processWheel()
        this.processTouch()
    }
    _.Command.prototype.shiftMode=function(){
        _.Window.prototype.shiftMode.call(this);
        this._arrow={}
        this._time=0
        this.cleanDraw(3)
    }
    _.Command.prototype.location=function(){
        _.Window.prototype.location.call(this);
        if(!this.isRun(3)) this.setRun(3,true)
    }

    _.Command.prototype.processWheel = function() {
        if(this._interval[0]===0&&this.hasActions()===0&&this.isOpe(1)){
            let threshold = 20;
            if (TouchInput.wheelY >= threshold) this.topRow(-1)
            if (TouchInput.wheelY <= -threshold) this.topRow(1)
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
            else if (TouchInput.isCancelled()) this.select(-1);
        }
    }

    _.Command.prototype.drawArrow = function() {
        let option = this._data.option;
        const arrowKeys = Object.keys(option.arrow);
        if (option.arrow) {
            for (let key of arrowKeys) {
                this.newArrow(option, key);
                let item = option.arrow[key];
                let index = parseInt(this._time / item.frame);
                let data = item.image[index % item.image.length];

                if (item.image.length > 1 && this._time % item.frame === 1) {
                    let bit = this._origin.getBit(data.bit);
                    bit.addLoadListener(() => {
                        this._arrow[key].bitmap = new Bitmap(data.w, data.h);
                        this._arrow[key].bitmap.blt(bit, data.x, data.y, data.w, data.h, 0, 0);
                    });
                }

                let rotation, x, y, scaleX, scaleY;

                if (typeof item.rota !== 'object') {rotation = (data.rota + item.rota) / 180 * Math.PI;}
                else {
                    let r = LIM.UTILS.waveNum(item.rota.wave, item.rota.frae / (1 + item.rota.fre * 2), this._time);
                    rotation = (data.rota + item.rota.val1 + r * (item.rota.val2 - item.rota.val1)) / 180 * Math.PI;
                }

                if (typeof item.x !== 'object') {x = LIM.UTILS.lengthNum(item.x);}
                else {
                    let r = LIM.UTILS.waveNum(item.x.wave, item.x.frae / (1 + item.x.fre * 2), this._time);
                    x = LIM.UTILS.lengthNum(item.x.val1) + r * (LIM.UTILS.lengthNum(item.x.val2) - LIM.UTILS.lengthNum(item.x.val1));
                }

                if (typeof item.y !== 'object') {y = LIM.UTILS.lengthNum(item.y);}
                else {
                    let r = LIM.UTILS.waveNum(item.y.wave, item.y.fra / (1 + item.y.fre * 2), this._time);
                    y = LIM.UTILS.lengthNum(item.y.val1) + r * (LIM.UTILS.lengthNum(item.y.val2) - LIM.UTILS.lengthNum(item.y.val1));
                }

                if (typeof item.sw !== 'object') {scaleX = item.sw;}
                else {
                    let r = LIM.UTILS.waveNum(item.sw.wave, item.sw.fra / (1 + item.sw.fre * 2), this._time);
                    scaleX = item.sw.val1 + r * (item.sw.val2 - item.sw.val1);
                }

                if (typeof item.sh !== 'object') {scaleY = item.sh;}
                else {
                    let r = LIM.UTILS.waveNum(item.sh.wave, item.sh.fra / (1 + item.sh.fre * 2), this._time);
                    scaleY = item.sh.val1 + r * (item.sh.val2 - item.sh.val1);
                }

                this._arrow[key].rotation = rotation;
                this._arrow[key].x = x;
                this._arrow[key].y = y;
                this._arrow[key].scale.x = scaleX;
                this._arrow[key].scale.y = scaleY;
            }
        }
    };
    
    _.Command.prototype.updataArrow=function (option){
        if(this._arrow['up'])
            this._arrow['up'].alpha=option.top>0?1:0
        if(this._arrow['down'])
            this._arrow['down'].alpha=option.top<this.topMax(option)?1:0
    }
    _.Command.prototype.newArrow=function (option,key){
        if(!this._arrow[key]&&option.arrow[key]){
            this._arrow[key]= new Sprite()
            this._arrow[key].type = 3
            this._arrow[key].anchor.set(0.5, 0.5);
            this.addChild( this._arrow[key])
            this.updataArrow(option)
        }
    }
    
    _.Command.prototype.drawCursor = function() {
        let option = this._data.option;
        const cursorKeys = Object.keys(option.cursor);
        if (option.cursor) {
            let rect={x1:0,x2:0,y1:0,y2:0};
            if (this._option[option.select]) rect = this._option[option.select];
            for (let key of cursorKeys) {
                this.newCursor(option, key);
                let item = option.cursor[key];
                let index = parseInt(this._time / item.frame);
                let data = item.image[index % item.image.length];

                if (item.image.length > 1 && this._time % item.frame === 1) {
                    let bit = this._origin.getBit(data.bit);
                    bit.addLoadListener(() => {
                        this._cursor[key].bitmap = new Bitmap(data.w, data.h);
                        this._cursor[key].bitmap.blt(bit, data.x, data.y, data.w, data.h, 0, 0);
                    });
                }

                this._cursor[key].alpha = option.select>-1?1:0

                let sx = 0;
                let sy = 0;

                if (item.mode % 3 === 0) sx = rect.x2;
                else if (item.mode % 3 === 0) sx = rect.x1 + (rect.x2 - rect.x1) / 2;
                else sx = rect.x1;

                if (item.mode / 3 > 2) sy = rect.y1;
                else if (data.item / 3 > 1) sy = rect.y1 + (rect.y2 - rect.y1) / 2;
                else sy = rect.y2;

                let rotation, x, y, scaleX, scaleY;

                if (typeof item.rota !== 'object') {
                    rotation = (data.rota + item.rota) / 180 * Math.PI;
                } else {
                    let r = LIM.UTILS.waveNum(item.rota.wave, item.rota.frae / (1 + item.rota.fre * 2), this._time);
                    rotation = (data.rota + item.rota.val1 + r * (item.rota.val2 - item.rota.val1)) / 180 * Math.PI;
                }

                if (typeof item.x !== 'object') {
                    x = LIM.UTILS.lengthNum(item.x) + sx;
                } else {
                    let r = LIM.UTILS.waveNum(item.x.wave, item.x.frae / (1 + item.x.fre * 2), this._time);
                    x = LIM.UTILS.lengthNum(item.x.val1) + r * (LIM.UTILS.lengthNum(item.x.val2) - LIM.UTILS.lengthNum(item.x.val1)) + sx;
                }

               if (typeof item.y !== 'object') {
                    y = LIM.UTILS.lengthNum(item.y) + sy;
                } else {
                    let r = LIM.UTILS.waveNum(item.y.wave, item.y.fra / (1 + item.y.fre * 2), this._time);
                    y = LIM.UTILS.lengthNum(item.y.val1) + r * (LIM.UTILS.lengthNum(item.y.val2) - LIM.UTILS.lengthNum(item.y.val1)) + sy;
                }

                if (typeof item.sw !== 'object') {
                    scaleX = item.sw;
                } else {
                    let r = LIM.UTILS.waveNum(item.sw.wave, item.sw.fra / (1 + item.sw.fre * 2), this._time);
                    scaleX = item.sw.val1 + r * (item.sw.val2 - item.sw.val1);
                }

                if (typeof item.sh !== 'object') {
                    scaleY = item.sh;
                } else {
                    let r = LIM.UTILS.waveNum(item.sh.wave, item.sh.fra / (1 + item.sh.fre * 2), this._time);
                    scaleY = item.sh.val1 + r * (item.sh.val2 - item.sh.val1);
                }

                this._cursor[key].rotation = rotation;
                this._cursor[key].x = x;
                this._cursor[key].y = y;
                this._cursor[key].scale.x = scaleX;
                this._cursor[key].scale.y = scaleY;
            }
        }
    };
    _.Command.prototype.newCursor=function (option,key){
        if(!this._cursor[key]&&option.cursor[key]){
            this._cursor[key]= new Sprite()
            this._cursor[key].type = 4
            this._cursor[key].anchor.set(0.5, 0.5);
            this.addChild( this._cursor[key])
        }
    }
    
    _.Command.prototype.drawOption = function(option) {
        if(this.isRun(3)) this.setRun(3,false)
        this.cleanDraw(2)
        this._option={}
        if(option.item) {
            for(let key of this.showOption(option)) {
                let rect = this.itemRect(option,key)
                let listItem = this._list[key] = {mode: option.item[key].mode || 0}
                let bitData = this.getOptionData(option,key)
                let bit = this._origin.getBit(bitData.bit)
                let item =option.item[key]
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
                        this._option[key]={x1:rect.x,y1:rect.y,x2:rect.x+sw,y2:rect.y+sh}

                        this.drawTxt(sp,item)
                        this.addChildAt(sp,0)
                        this.bit(bit, sp.bitmap, bitData, [size0, size1])
                    }
                }.bind(this))
            }
        }
    }
    _.Command.prototype.itemRect = function(option,index) {
        let rect = new Rectangle();
        let h = this.height - this._data.padding[1] * 2;
        let w = this.width - this._data.padding[0] * 2;
        let cols = option.cols;
        let row = option.row;
        let margin0 = option.margin[0];
        let margin1 = option.margin[1];
        switch (option.mode) {
            case 0:
                index-=option.top*option.cols
                w /= cols;
                h /= row;
                w -= margin0 * 2;
                h -= margin1 * 2;
                rect.width = w;
                rect.height = h;
                let r0 = parseInt(index / cols)
                let c0 = index % cols;
                rect.x = this._data.padding[0] + (c0 * w) + ((c0 * 2 + 1) * margin0);
                rect.y = this._data.padding[1] + (r0 * h) + ((r0 * 2 + 1) * margin1);
                break
            case 1:
                index-=option.top*option.cols
                w /= row;
                h /= cols ;
                w -= margin0 * 2;
                h -= margin1 * 2;
                rect.width = w;
                rect.height = h;
                let r1 =  index % cols;
                let c1 =  parseInt(index / cols)
                rect.x = this._data.padding[0] + (c1 * w) + ((c1 * 2 + 1) * margin0);
                rect.y = this._data.padding[1] + (r1 * h) + ((r1 * 2 + 1) * margin1);
                break
            default:
                rect.width = option.item[index].rect.w||0;
                rect.height =  option.item[index].rect.h||0;
                rect.x= (option.item[index].rect.x||0)+this._data.padding[0]-option.layout[option.top].redu[0];
                rect.y= (option.item[index].rect.y||0)+this._data.padding[1]-option.layout[option.top].redu[1];
                break
        }
        return rect;
    }
    _.Command.prototype.getOptionData = function(option, key) {
        const keyItem = option.item[key];
        const keyItemUseUi = keyItem && keyItem.useUi;
        const optionUseUi = option.useUi;
        const isActivation = option.activation == key;
        const isSelect = option.select == key;
        const isDisable = option.disable.indexOf(key) > -1;

        if (isActivation) return (keyItemUseUi && keyItemUseUi.act) || (optionUseUi && optionUseUi.act) || null;
        if (isSelect) {
            if (isDisable) return (keyItemUseUi && keyItemUseUi.dse) || (optionUseUi && optionUseUi.dse) || null;
            return (keyItemUseUi && keyItemUseUi.sel) || (optionUseUi && optionUseUi.sel) || null;
        }
        if (isDisable) return (keyItemUseUi && keyItemUseUi.dis) || (optionUseUi && optionUseUi.dis) || null;
        return (keyItemUseUi && keyItemUseUi.vis) || (optionUseUi && optionUseUi.vis) || null;
    };
 

    _.Command.prototype.drawTxt = function(sp,item){
        let data=this._data.option.itemText||{x:0,y:0,padding:[0,0]}
        let txt=new Sprite(this._origin.getTextBit(item.text.id))
        let w=txt.width
        let h =txt.height
        txt.width=sp.width-(item.padding?item[0]:data.padding[0])*2
        txt.height=sp.height-(item.padding?item[1]:data.padding[1])*2
        
        txt.x=(item.x||data.x)+(item.padding?item[0]:data.padding[0])+(item.text.align?(txt.width-w)/item.text.align:0)
        txt.y=(item.y||data.y)+(item.padding?item[1]:data.padding[1])+(item.text.verti?(txt.height-h)/item.text.verti:0)
        sp.addChild(txt)
    }
    _.Command.prototype.isTouch=function () {
        return TouchInput.x>this.getX()&&
            TouchInput.x<this.getX()+this.width&&
            TouchInput.y>this.getY()&&
            TouchInput.y<this.getY()+this.height
    }
    
    _.Command.prototype.topMax =function (option){
        let max = 0;
        let row;
        switch (option.mode){
            case 0:
            case 1:
                for (let key in option.item) if (max === 0 ||parseInt(key) > max) max = key;
                row = Math.ceil(max/option.cols)-option.row
                break
            default:
                row = option.topMax||0
                break
        }
        return row
    }
    _.Command.prototype.topRow =function (i){
        this._interval[0]=30
        let option= this._data.option
        let row = this.topMax(option);
       
        if(option.select<0) this.select(this.findOption(option))  //没有选择
        else {
            //滚动top
            if(row==-1||(i==1&&option.top==0)||(i==-1&&option.top==row)){} 
            else {
                option.top -= i
                Conductor.start("v3")
            }
            //改变选项
            let select=this.findOption(option,i)
            if(select>-1) this.select(select)
            else {
                let s1=option.select
                option.select=-1
                let s2=this.findOption(option)
                if(s2!=s1) this.select(s2)
                else option.select=s1
            }
        }
        this.updataArrow(option)
    }
    _.Command.prototype.select =function (index){
        let option= this._data.option
        if(option.select!=index) {
            option.select = index
            Conductor.start("v4")
            if(!this.isRun(3)) this.setRun(3,true)
        }
    }
    _.Command.prototype.showOption=function (option){
        let arr=[]
        if(option.item)
            switch (option.mode){
                case 0:
                case 1:
                    for(let key of Object.keys(option.item)){
                        let offset=option.top*option.cols
                        if(!(key-offset<0||key-offset>=option.row*option.cols))
                            arr.push(key)
                    }
                    break
                default:
                    if(option.layout){
                        let w=this._data.w-this._data.padding[0]*2
                        let h=this._data.h-this._data.padding[1]*2
                        let x=option.layout[option.top].redu[0]
                        let y=option.layout[option.top].redu[1]
                        for(let i=option.top;i<option.layout.length;i++)
                           for(let item of option.layout[i].menber){
                              if(!option.item[item]) continue
                              let rect=option.item[item].rect
                              if(w>=rect.w+rect.x-x&&h>rect.h+rect.y-y)
                                  arr.push(item)
                           }
                    }
            }
        return arr
    }
    _.Command.prototype.findOption=function (option,i){
        switch (option.mode){
            case 0:
            case 1:
                let min=option.top*option.cols
                let max=min+option.cols*option.row
                if(option.select==-1){
                     for(let i=min;i<max;i++) if(option.item[i]) return i
                }
                else{
                    if(i==-1) {
                        for (let k = option.select + option.cols; k < max; k += option.cols) if (option.item[k]) return k
                    }
                    else {
                        for (let k = option.select - option.cols; k >= min; k -= option.cols) if (option.item[k]) return k
                    }
                }
                return -1
            default:
                if(option.select!==-1) {
                    let line = 0
                    if(i==-1) {
                        for (let i = 0; i < option.layout.length - 1; i++)
                            if (option.layout[i].menber.indexOf(option.select) > -1) {
                                line = i;
                                return option.layout[line + 1].menber[0]
                            }
                    }
                    else {
                        for (let i = 1; i < option.layout.length; i++)
                            if (option.layout[i].menber.indexOf(option.select) > -1) {
                                line = i;
                                return option.layout[line - 1].menber[0]
                            }
                    }
                }
                return option.layout[option.top].menber[0]    
               
        }
      
    }
})(LIM.SCENE);