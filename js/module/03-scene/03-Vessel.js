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
        
        this._com=com
        this._name=name
        
        this._time=0
        this._filkey=""
        this._com.next=0
        this._com.mode=-1
        this._filter=new LIM.SCENE.Filter()
        this._origin=origin
        this._symbol=com.symbol||{}
        this._se=com.se||{}
        Sprite.prototype.initialize.call(this);//;
    }


    _.Vessel.prototype.update = function () {
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Vessel.prototype.refresh=function () {
        this._time++
        if(!this.refreshFilter()) {
            if(this._com.next!==this._com.mode) this.shiftMode()
            if(this.hasActions()===1) this.move()
            if (this.isRun(4)) this.createFilter()
        }
    }
    
    _.Vessel.prototype.refreshFilter =function (){
        let data = this.updateFilter()
        if(data[1]!==this._filkey) {
            this._filkey.key
            let s = data[1].split(":").slice(1)
            switch (s.length) {
                case 0:
                    this.filters = [];
                    break
                case 1:
                    this.filters = [this._filter.filter[s[0]].app];
                    break
                case 2:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app];
                    break
                case 3:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                        this._filter.filter[s[2]].app];
                    break
                case 4:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                        this._filter.filter[s[2]].app, this._filter.filter[s[3]].app];
                    break
                case 5:
                    this.filters =  [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                        this._filter.filter[s[2]].app, this._filter.filter[s[3]].app, this._filter.filter[s[4]].app];
                    break
                case 6:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,this._filter.filter[s[2]].app,
                        this._filter.filter[s[3]].app, this._filter.filter[s[4]].app,this._filter.filter[s[5]].app];
                    break
                case 7:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                        this._filter.filter[s[2]].app, this._filter.filter[s[3]].app,
                        this._filter.filter[s[4]].app, this._filter.filter[s[5]].app,this._filter.filter[s[5]].app];
                    break
            }
        }
        if(data[2]) console.log(data[2])
        return data[0]
    }
    _.Vessel.prototype.updateFilter = function () {
        return this._filter.updateFilter()
    }
    _.Vessel.prototype.createFilter = function () {
        if (this.isRun(4)) {this.setRun(4, false)}
        this._filter=new LIM.SCENE.Filter()
        if(this._data&&this._data.filter) {
            for (let key in this._data.filter)
                this._filter.createFilter(key, this._data.filter[key])
        }
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

            if(item.frame) this._action.push({data:data,time:0,frame:item.frame,wave:item.wave,com:item.com})
            else {
                this.x=x
                this.y=y
                this.alpha=this._data.alpha
            }
        }
        else if(!this.isRun(0)) this.setRun(0,true)
    }
    _.Vessel.prototype.move = function() {
        let action = this._action[0]
        if(action.time > 0) {
            let r = LIM.UTILS.waveNum(action.wave, action.frame*4, action.time,1)
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
        }
        else {this._action.splice(0, 1)}
    }
    
    
    
    _.Vessel.prototype.isActi=function(){return this._com.acti}
    _.Vessel.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Vessel.prototype.setRun=function(bit,bool){this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);}
    _.Vessel.prototype.isOpe=function(bit){return LIM.UTILS.atBit(this._com.ope,bit)}
    _.Vessel.prototype.setOpe=function(bit,bool){
        this._com.ope = LIM.UTILS.setBit(this._com.ope,bit,bool);
    }
    _.Vessel.prototype.hasActions=function () {
        let c=0
        for (let current = this; current; current = current.parent) {
            c++;
            if (current._action && current._action.length > 0) return c;
        }
        return 0;
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