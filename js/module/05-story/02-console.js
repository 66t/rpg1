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
        this._origin._origin.playSound("load")
        this._origin._origin.playSound("noise")
        this._load=-6
        this._per={}
        this._word={}
        this._bit=[]
        this._index=0
        this._run=[1,1,1,1,1]
    }
    _.Console.prototype.update=function (){
        switch (this._load) {
            case -6:
                this._load=-5
                LIM.$story.getScript()
                break;
            case -5:
                if($dataScript) 
                    this.readyLoadBit()
                break
            case -4:
                this.readyLoadFont()
                break
            case -3: 
                this.checkFont()
                break
            case -2:
                if(this._origin._time>60) {
                    this._load=-1
                    this._origin._origin.setFont(this._word)
                    this._sys.triggerHandler("load",$dataScript.back)
                    this._origin._origin.loadSound($dataScript.sound[0],$dataScript.sound[1],$dataScript.sound[2],$dataScript.sound[3])
                    this._origin._origin.stopSound(10)
                }
                break
            case 0: this.run()
                break
                
        }
    }

    _.Console.prototype.readyLoadBit = function () {
        this._load=-4;
        for(let key of $dataScript.performer){
            if($dataRole[key]){
                this._per[key]=$dataRole[key]
                this._origin._origin.loadBitmap("p_"+key,["img/faces/",$dataRole[key].img,0,true])
            }
        }
    }
    _.Console.prototype.readyLoadFont = function () {
        this._load = -3;
        this._loadFont = {};
        this.loadFontIfNeeded($dataScript.time);
        this.loadFontIfNeeded($dataScript.location);
        for (let key in $dataScript.text)
          this.loadFontIfNeeded($dataScript.text[key]);
    }
    _.Console.prototype.loadFontIfNeeded = function (file) {
        this._word[file] = null;
        file = file.split("_")[0];
        if (!this._loadFont[file]) this.loadFont(file);
    }
    _.Console.prototype.loadFont = function (file) {
        this._loadFont[file] = { data: null, load: 0 };
        DataManager.loadDataFile(file, 'text/' + file + '.json', this._loadFont);
    }
    _.Console.prototype.checkFont = function () {
        for (let key in this._loadFont)
            if (this._loadFont[key].load == 1) {
                let data = this._loadFont[key].data;
                for (let key in data) {
                    let arr = data[key].arr;
                    for (let p of arr) {
                        if (p[0] === "@") {
                            p = p.slice(1);
                            this.loadFontIfNeeded(p);
                        }
                    }
                }
                this._loadFont[key].load = 2;
            }
        let allTextLoaded = Object.values(this._loadFont).every(item => item.load === 2);
        if (allTextLoaded) {
            for(let key in this._word)
                this._word[key]=this._loadFont[key.split("_")[0]].data[key]
            delete this._loadFont
            this._load = -2;
        }
    }


    _.Console.prototype.setLoad=function (val){
        this._load=val
    }
    _.Console.prototype.next=function (){
        this._run[0]=1
    }
    
    _.Console.prototype.run=function (){
        if(!this._run[0]) return;
        while (this._index<$dataScript.com.length){
            if(!this.execute( $dataScript.com[this._index++])){
                this._run[0]=0;return
            }
        }
    }
    _.Console.prototype.execute =function (com){
        switch (com.id){
            case 1: return false
            case 4: //激活文字框
                this._origin._origin.exFun(['#activa',"t_text"])
                break
            case 5: //载入文字框
                this._origin._origin.exFun(['#run',"t_text",0])
                break
            case 6: //开始文字框
                this._origin._origin.exFun(['#run',"t_text",2])
                return false
            case 10: //设置名称
                this._origin._origin.exFun(['#setFormer',com.data])
                break
            case 11: //设置文字
                this._origin._origin.exFun(['#setStory',com.data])
                break
            
            
            case 70: //为立绘添加模式
                this._origin._origin.exFun(['#pushData','s_stage_'+com.data[0],com.data[1]])
                break
            case 71://为立绘添加属性
                this._origin._origin.exFun(['#setDatas','s_stage_'+com.data[0],com.data[1],com.data[2]])
                break
            
            case 75://设置动作属性
                this._origin._origin.exFun(['#setActAttr','s_stage_'+com.data[0],com.data[1],com.data[2],com.data[3]])
                break
      
            case 100://激活图像
                this._origin._origin.exFun(['#activa','s_stage_'+com.data[0]])
                break
            default:
                console.log(1111111)
                break
        }
        return true
    }
    
})(LIM.STORY);