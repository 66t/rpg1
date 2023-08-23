var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=>{
    _.Command=function(){this.initialize.apply(this,arguments)}
    _.Command.prototype = Object.create(_.Window.prototype)
    _.Command.prototype.constructor = _.Command;
    _.Command.prototype.initialize = function (origin,name,com) {
        _.Window.prototype.initialize.call(this,origin,name,com);
    }
})(LIM.SCENE);