//===========================
// @-02-console
// @Path      js/module/05-story
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/20)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.STORY=LIM.STORY||{};
(function(_) {

    _.Console=function(){this.initialize.apply(this,arguments)}
    _.Console.prototype = Object.create(_.Console.prototype)
    _.Console.prototype.constructor = _.Console;
    _.Console.prototype.initialize = function (origin) {
        this._origin=origin
        console.log($dataTree)
    }
    _.Console.prototype.update=function (){}
    
})(LIM.STORY);