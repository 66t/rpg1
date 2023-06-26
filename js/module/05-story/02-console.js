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
((_)=> {

    _.Console=function(){this.initialize.apply(this,arguments)}
    _.Console.prototype = Object.create(_.Console.prototype)
    _.Console.prototype.constructor = _.Console;
    _.Console.prototype.initialize = function (origin) {
        this._origin=origin
        this._sys=origin._origin
        this._load=-4
    }
    _.Console.prototype.update=function (){
        switch (this._load) {
            case -4:
                this._load=-3
                LIM.$story.getScript()
                break;
            case -3:
                if($dataScript) this._load=-2;break
            case -2:
                if(this._origin._time>60) {
                    this._load=-1
                    this._sys.triggerHandler("back_load",$dataScript.back)
                }
                break
                
        }
    }
    
})(LIM.STORY);