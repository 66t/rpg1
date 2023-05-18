var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Shape=function(){this.initialize.apply(this,arguments)}
    _.Shape.prototype = Object.create(Sprite.prototype)
    _.Shape.prototype.constructor = _.Shape;
    _.Shape.prototype.initialize = function (origin,name,com) {
        this._com=com
        this._name=name
        this._origin=origin
        Sprite.prototype.initialize.call(this);//;
    }
})(LIM.SCENE);