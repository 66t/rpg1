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
        this._time=0
        
        this._com.next=0
        this._com.mode=-1
    
        
        this._name=name
        this._filter={}
        this._origin=origin
        
        
        this._symbol=com.symbol||{}
        this._se=com.se||{}
        Sprite.prototype.initialize.call(this);//;
    }

    
    
    
    
    
    _.Vessel.prototype.isActi=function(){return this._com.acti}
    _.Vessel.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Vessel.prototype.setRun=function(bit,bool){this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);}
    _.Vessel.prototype.isOpe=function(bit){return LIM.UTILS.atBit(this._com.ope,bit)}
    _.Vessel.prototype.setOpe=function(bit,bool){
        this._com.ope = LIM.UTILS.setBit(this._com.ope,bit,bool);
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