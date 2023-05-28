var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Vessel=function(){this.initialize.apply(this,arguments)}
    _.Vessel.prototype = Object.create(Sprite.prototype)
    _.Vessel.prototype.constructor = _.Vessel;
    Object.defineProperties(_.Vessel.prototype, {
     _index: {get: function () {return this._data?this._data.index:0}, configurable: true}});

    _.Vessel.prototype.initialize = function (origin,name,com) {
        this._action=[]
        this._com=com
        this._com.mode=-1
        this._com.next=0
        this._name=name
        this._origin=origin
        Sprite.prototype.initialize.call(this);//;
    }

    _.Vessel.prototype.update = function () {
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Vessel.prototype.move = function() {
        let action = this._action[0]
        if(action.time > 0) {
            let actionData = action.data
            let r = LIM.UTILS.waveNum(action.wave, action.frame, action.time)
            let bool = false
            for (let key of Object.keys(actionData)) {
                let v = r * (actionData[key][1] - actionData[key][0]) + actionData[key][0]
                if(key === "x" || key === "y") {
                    this[key] = v
                    bool = true
                } else if(key === "alpha") {
                    this.alpha = v
                }
            }
            if(bool) this.triggerMove()
        }
        if(action.time < action.frame) {
            action.time++
        } else {
            this._origin.triggerFun(action.fun)
            this._action.splice(0, 1)
        }
    }
    _.Vessel.prototype.refresh=function () {
      
        if(this._com.next!==this._com.mode) this.shiftMode()
        if(this.isRun(0)) this.location()
        if(this.hasActions()==1) this.move()
    }
    _.Vessel.prototype.shiftMode=function(){
        let index1=this._index
        this._data=this._com.data[this._com.next]
        let index2=this._index
        if(index1!=index2&&!this._origin.isRun(1)) this._origin.setRun(1,true)
         let mode=this._com.mode
        this._com.mode=this._com.next
        this.pushAction(mode,this._com.next)
     
    }
    _.Vessel.prototype.pushAction=function(mode,next){
        let fun=mode+"_"+next
        if(this._com.action[fun]){
            let v=this._com.action[fun]
            let data={}
            let x=LIM.UTILS.lengthNum(this._data.x)
            let y=LIM.UTILS.lengthNum(this._data.y)
            if(this.x!==x) data.x=[this.x,x]
            if(this.y!==y) data.y=[this.y,y]
            if(this.alpha!==this._data.alpha) data.alpha=[this.alpha,this._data.alpha]
            if(v.frame) this._action.push({data:data,time:0,frame:v.frame,wave:v.wave,fun:v.fun})
            else {
                this.x=x
                this.y=y
                this.alpha=this._data.alpha
                this._origin.triggerFun(v.fun)
            }
        }
        else if(!this.isRun(0)) this.setRun(0,true)
    }
    _.Vessel.prototype.location=function(){
        if(this.isRun(0)) this.setRun(0,false)
        this.x=LIM.UTILS.lengthNum(this._data.x)
        this.y=LIM.UTILS.lengthNum(this._data.y)
        this.alpha=LIM.UTILS.lengthNum(this._data.alpha)
        this.triggerMove()
    }
    _.Vessel.prototype.isActi=function(){return this._com.acti}
    _.Vessel.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Vessel.prototype.setRun=function(bit,bool){
        this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);
    }

    _.Vessel.prototype.isOpe=function(bit){return LIM.UTILS.atBit(this._com.ope,bit)}
    _.Vessel.prototype.setOpe=function(bit,bool){
        this._com.ope = LIM.UTILS.setBit(this._com.ope,bit,bool);
    }
    _.Vessel.prototype.bit=function(bit,bitmap,image,size){
        for (let y = 0; y < size[1] + 2; y++)
            for (let x = 0; x < size[0] + 2; x++)
                if (y === 0) {
                    if (x === 0)
                        bitmap.blt(bit, image.x1, image.y1, image.x2 - image.x1, image.y2 - image.y1, 0, 0);
                    else if (x === size[0] + 1)
                        bitmap.blt(bit, image.x3, image.y1, image.x4 - image.x3, image.y2 - image.y1, (image.x2 - image.x1) + (image.x3 - image.x2) * (x - 1), 0);
                    else
                        bitmap.blt(bit, image.x2, image.y1, image.x3 - image.x2, image.y2 - image.y1, (image.x2 - image.x1) + (image.x3 - image.x2) * (x - 1), 0);
                }
                else if (y === size[1] + 1) {
                    if (x === 0)
                        bitmap.blt(bit, image.x1, image.y3, image.x2 - image.x1, image.y4 - image.y3, 0, (image.y2 - image.y1) + (image.y3 - image.y2) * (y - 1));
                    else if (x === size[0] + 1)
                        bitmap.blt(bit, image.x3, image.y3, image.x4 - image.x3, image.y4 - image.y3, (image.x2 - image.x1) + (image.x3 - image.x2) * (x - 1), (image.y2 - image.y1) + (image.y3 - image.y2) * (y - 1));
                    else
                        bitmap.blt(bit, image.x2, image.y3, image.x3 - image.x2, image.y4 - image.y3, (image.x2 - image.x1) + (image.x3 - image.x2) * (x - 1), (image.y2 - image.y1) + (image.y3 - image.y2) * (y - 1));
                }
                else {
                    if (x === 0)
                        bitmap.blt(bit, image.x1, image.y2, image.x2 - image.x1, image.y3 - image.y2, 0, (image.y2 - image.y1) + (image.y3 - image.y2) * (y - 1));
                    else if (x === size[0] + 1)
                        bitmap.blt(bit, image.x3, image.y2, image.x4 - image.x3, image.y3 - image.y2, (image.x2 - image.x1) + (image.x3 - image.x2) * (x - 1), (image.y2 - image.y1) + (image.y3 - image.y2) * (y - 1));
                    else
                        bitmap.blt(bit, image.x2, image.y2, image.x3 - image.x2, image.y3 - image.y2, (image.x2 - image.x1) + (image.x3 - image.x2) * (x - 1), (image.y2 - image.y1) + (image.y3 - image.y2) * (y - 1));

                }
    }

    _.Vessel.prototype.hasActions=function () {
        let c=0
        for (let current = this; current; current = current.parent) {
            c++;
            if (current._action && current._action.length > 0) return c;
        }
        return 0;
    }

    _.Vessel.prototype._getTotalValue = function(propertyName) {
        let total = this[propertyName];
        for (let current = this; current && current.parent && current.parent[propertyName]; current = current.parent) {
            total += current.parent[propertyName];
        }
        return total;
    }
    _.Vessel.prototype.getX = function() {return this._getTotalValue('x');}
    _.Vessel.prototype.getY = function() {return this._getTotalValue('y');}
    _.Vessel.prototype.triggerMove=function () {
        for(let item of this.children)
            if(!item.type) if(!item.isRun(4)) item.setRun(4,true)
    }
})(LIM.SCENE);