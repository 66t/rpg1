var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Shape=function(){this.initialize.apply(this,arguments)}
    _.Shape.prototype = Object.create(Sprite.prototype)
    _.Shape.prototype.constructor = _.Shape;
    Object.defineProperties(_.Shape.prototype, {
        _index: {
            get: function ()
            {return this._com.data.length>this._com.next?this._com.data[this._com.next].index:0;},
            configurable: true}
    });
    _.Shape.prototype.initialize = function (origin,name,com) {
        this._com=com
        this._name=name
        this._origin=origin
        Sprite.prototype.initialize.call(this);//;
        this.drawBack()
    }

    _.Shape.prototype.drawBack = function() {
       if(!this._com.bit) return
        let bit = this._origin.getBit(this._com.bit)
        bit.addLoadListener(function () {
            this.bitmap=bit
        }.bind(this))
    }

    _.Shape.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if(this.isActi()) {
            this.refresh()
        }
    }

    _.Shape.prototype.isActi=function(){return this._com.acti}
    _.Shape.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Shape.prototype.setRun=function(bit,bool){
        this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);
    }
    
    
})(LIM.SCENE);