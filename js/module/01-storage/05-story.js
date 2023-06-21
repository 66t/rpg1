//===========================
// @-05-story
// @Path      js/module/01-storage
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/18)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.STORAGE=LIM.STORAGE||{};
(function(_){

    _.Story=function(){this.initialize.apply(this,arguments)}
    _.Story.prototype=Object.create(_.Story.prototype)
    _.Story.prototype.constructor=_.Story
    _.Story.prototype.initialize=function(){
        this.time=0
        this.exp={}
    };
    _.Story.prototype.getScript=function (){
        $dataScript=null
        for(let key in $dataTree){
            DataManager.loadDataFile('$dataScript', 'script/' +key.replace(/_/g,"/") + '.json');
            return
        }
    }
})(LIM.STORAGE);