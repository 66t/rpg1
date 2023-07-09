//===========================
// @-01-scene
// @Path      js/module/04_scene
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/7/9)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};

((_)=> {

    _.Scene = function () { this.initialize.apply(this, arguments) }
    _.Scene.prototype = Object.create(Scene_Base.prototype);
    _.Scene.prototype.constructor = _.Scene;
    _.Scene.prototype.initialize = function (name) {
        this.startRunning(name);
        Scene_Base.prototype.initialize.call(this);
    }
    //开始运行
    _.Scene.prototype.startRunning = function (name) {
        $dataScene=null
        this._load = -5
        DataManager.loadDataFile('$dataScene', 'scene/' + name + '.lim');
    }
    
    //已加载
    _.Scene.prototype.checkDataLoaded = function () {
        if ($dataScene){
            for(let com of this.Escape($dataScene)) this.exFun(com)
            this._load = -4;
            console.log(this._data)
        }
    }
    _.Scene.prototype.Escape=function (txt) { 
        let arr=[]
        let p=txt.replace(/[\r\n]/g, '').split("-)")
        for(let item of p){
            if(!item) continue
            let q=item.split("->")
            let com=[]
            for(let i=0;i<q.length;i++){
                if(i===0) com.push("#"+q[i].trim())
                else {
                    q[i]=q[i].trim()
                    if(q[i][0]==="@"){
                       let r=q[i].split("|-|")
                       switch (r[0]){
                           case "@arr":
                               let arr=[]
                               for(let j=1;j<r.length;j++)
                                   arr.push(this.convert(r[j].trim()))
                               com.push(arr)
                               break
                       } 
                    }
                    else com.push(this.convert(q[i]))
                }
            }
            arr.push(com)
        }
        return arr
    }
    _.Scene.prototype.convert=function (s){
        if(s instanceof Object) return s
        s=s.split("!")
        if(s.length>1){
            switch (s[1]) {
                case "binary": return  parseInt(s[0], 2)
                case "int":return s[0]*1
                case "bool":return s[0]==="T"

            }
        }
        else  return s[0]
    }


    //执行
    _.Scene.prototype.exFun=async function(eve){
        switch (eve[0]) {
            case 0:
            case "#data":
                this._data=LIM.ENTITY.Scene()
                break
            case 11:
            case "#pushBit":
                this._data.bit[eve[1]]=eve[2]
                break
            
            case 21:
            case "#pushVes":
                this._data.vessel[eve[1]]=LIM.ENTITY.Vessel()
                break
            case 22:
            case "#portVes":
                this._data.vessel[eve[1]][eve[2]]=eve[3]
                break
            
            case 31:
            case "#pushSou":
                this._data.sound[eve[1]]=LIM.ENTITY.Sound()
                break
            case 32:
            case "#portSou":
                this._data.sound[eve[1]][eve[2]]=eve[3]
                break
            case 33:
            case "#confSou":
                this._data.sound[eve[1]].config[eve[2]]=eve[3]
                break
                
        }
    }
    
    _.Scene.prototype.update = function () {
        switch (this._load) {
            case -5:
                this.checkDataLoaded();
                break;
            case -4:
                break;
        }
    }
    
})(LIM.SCENE);