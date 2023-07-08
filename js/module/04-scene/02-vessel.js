var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=>{
    _.Vessel=function(){this.initialize.apply(this,arguments)}
    _.Vessel.prototype = Object.create(Sprite.prototype)
    _.Vessel.prototype.constructor = _.Vessel;
    Object.defineProperties(_.Vessel.prototype, {
     _index: {get: function () {return this._data?this._data.index:0}, configurable: true}});

    _.Vessel.prototype.initialize = function (origin,name,com) {
        this._action=[]
        this._time=0
        this._com=com
        this._com.mode=-1
        this._com.next=0
        this._name=name
        this._filter={}
        this._origin=origin
        this._symbol=com.symbol||{}
        this._se=com.se||{}
        Sprite.prototype.initialize.call(this);//;
        this.newMask()
    }
    _.Vessel.prototype.newMask = function () {
        this._mask= new PIXI.Graphics();
        this._mask.beginFill()
        this._mask.drawRect(0,0,Graphics.width,Graphics.height)
        this._mask.endFill();
    }
    _.Vessel.prototype.update = function () {
        this.updateFilter()
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Vessel.prototype.move = function() {
        let action = this._action[0]
        if(action.time > 0) {
            let r = LIM.UTILS.waveNum(action.wave, action.frame, action.time)
            this._mask.clear()
            this._mask.beginFill()
            if(!action.mask||action.mask.length===0) 
                this._mask.drawRect(0,0,Graphics.width,Graphics.height)
            else {
                for(let item of action.mask){
                   let r1=item.wave&&item.wave!==action.wave?LIM.UTILS.waveNum(item.wave, action.frame, action.time):r
                   let x= ((item.x[1]-item.x[0])*r1+item.x[0])
                   let y= ((item.y[1]-item.y[0])*r1+item.y[0])
                   let w= ((item.w[1]-item.w[0])*r1+item.w[0])
                   let h= ((item.h[1]-item.h[0])*r1+item.h[0])
                    this._mask.drawRect(x+this.x,y+this.y,w,h)
                }
            }
            this._mask.endFill();
            let actionData = action.data
         
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
            this._action.splice(0, 1)
            if(action.com)  this._origin.triggerHandler(action.com)
        }
    }
    _.Vessel.prototype.refresh=function () {
        if(this._com.next!==this._com.mode) this.shiftMode()
        if(this.isRun(4)) this.createFilter()
        if(this.isRun(0)) this.location()
        if(this.hasActions()===1) this.move()
        this._time++
    }
    _.Vessel.prototype.shiftMode=function(){
        let index1=this._index
        this._data=this._com.data[this._com.next]
        let index2=this._index
        if(index1!==index2&&!this._origin.isRun(1)) this._origin.setRun(1,true)
         let mode=this._com.mode
        this._com.mode=this._com.next
        this.pushAction(mode,this._com.next)
        this.setRun(4,true)
    }
    _.Vessel.prototype.pushAction=function(mode,next){
        let fun=mode+"_"+next
        if(this._com.action[fun]){
            let item=this._com.action[fun]
            let data={}
            let x=LIM.UTILS.lengthNum(this._data.x)
            let y=LIM.UTILS.lengthNum(this._data.y)
            if(this.x!==x) data.x=[this.x,x]
            if(this.y!==y) data.y=[this.y,y]
            if(this.alpha!==this._data.alpha) data.alpha=[this.alpha,this._data.alpha]
            
            if(item.frame) this._action.push({data:data,time:0,frame:item.frame,wave:item.wave,com:item.com,mask:item.mask})
            else {
                this.x=x
                this.y=y
                this.alpha=this._data.alpha
                if(item.com)  this._origin.triggerHandler(item.com)
            }
        }
        else if(!this.isRun(0)) this.setRun(0,true)
    }
    _.Vessel.prototype.location=function(){
        if(this.isRun(0)) this.setRun(0,false)
        this.x=LIM.UTILS.lengthNum(this._data.x)
        this.y=LIM.UTILS.lengthNum(this._data.y)
        this.alpha=this._data.alpha
        this.triggerMove()
    }
    
    _.Vessel.prototype.createFilter = function () {
        if (this.isRun(4)) {this.setRun(4, false)}
        this._filter={}
        for (let key in this._data.filter) {
            let data=this._data.filter[key]
            if (data.acti) {
                this._filter[key] = {data: data, obj: LIM.Filter(data.type),time:this._time}
                for(let uniforms in data.uniforms){
                    let src=uniforms.split(".")
                    let d1= this._filter[key].obj
                    let d2= this._filter[key].obj.uniforms
                    for(let i=0;i<src.length;i++){
                        if(i==src.length-1) {
                            if(d1) d1[src[i]]= data.uniforms[uniforms]
                            if(d2) d2[src[i]]= data.uniforms[uniforms]
                        }
                        else {
                            if(d1) d1=d1[src[i]];
                            if(d2) d2=d2[src[i]]}
                    }
                }
            }
        }
        this.showFilter()
    }
    _.Vessel.prototype.showFilter = function () {
        let key=Object.keys(this._filter)
        switch (key.length){
            case 0:this.filters=[]
                break
            case 1:
                this.filters=[this._filter[key[0]].obj]
                break
            case 2:
                this.filters=[this._filter[key[0]].obj,this._filter[key[1]].obj]
                break
            case 3:
                this.filters=[this._filter[key[0]].obj,this._filter[key[1]].obj,this._filter[key[2]].obj]
                break
        }
        this.updateFilter()
    }
    _.Vessel.prototype.updateFilter= function (){
        let destroy=false
        for(let key in this._filter){
            let filter = this._filter[key]
            let time=this._time-filter.time
            let data=LIM.UTILS.countWave(filter.data.wave,[100,time],filter.obj.uniforms)
            for(let uniforms in data){
                let src=uniforms.split(".")
                let d1= this._filter[key].obj
                let d2= this._filter[key].obj.uniforms
                for(let i=0;i<src.length;i++){
                    if(i===src.length-1) {
                        if(d1) d1[src[i]]= data[uniforms]
                        if(d2) d2[src[i]]= data[uniforms]
                    }
                    else {
                        if(d1) d1=d1[src[i]];
                        if(d2) d2=d2[src[i]]}
                }
            }
            if(filter.data.cycle>0&&time>filter.data.cycle){
                filter.data.acti=false
                delete this._filter[key]
                if(filter.data.comE) this.origin.triggerHandler(filter.data.comE)
                destroy=true
            }
        }
        if(destroy) this.showFilter()
    }
    _.Vessel.prototype.actiFilter= function (key,bool){
        this.setRun(4, true)
        this._data.filter[key].acti=(bool==="1")
    }
    
    _.Vessel.prototype.hasActions=function () {
        let c=0
        for (let current = this; current; current = current.parent) {
            c++;
            if (current._action && current._action.length > 0) return c;
        }
        return 0;
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
    
    _.Vessel.prototype.PlaySe=function (name){
        if(this._se&&this._se[name])
          this._origin.playSound(this._se[name])
    }
    
    _.Vessel.prototype.getTotalValue = function(propertyName) {
        let total = this[propertyName];
        for (let current = this; current && current.parent && current.parent[propertyName]; current = current.parent) {
            total += current.parent[propertyName];
        }
        return total;
    }
    _.Vessel.prototype.getX = function() {return this.getTotalValue('x');}
    _.Vessel.prototype.getY = function() {return this.getTotalValue('y');}
    _.Vessel.prototype.triggerMove=function () {
        for(let item of this.children)
            if(!item.type) if(!item.isRun(4)) item.setRun(4,true)
    }
})(LIM.SCENE);