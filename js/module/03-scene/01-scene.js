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
        this._name=name
        this.startRunning();
        Scene_Base.prototype.initialize.call(this);
    }
    //开始运行
    _.Scene.prototype.startRunning = function (json) {
        $dataScene=json||null
        this.children=[]
        this._load = -1
        this._cease = false
        this._run = 0;
        this._time = 0;
        
        this._bitload =[]
        
        this._data={}
        this._bit ={}
        this._txt ={}
        this._word={}

        this._heap = {}
        this._filter=new LIM.SCENE.Filter()
        this._filkey=""
        if(this._name&&!json) DataManager.loadDataFile('$dataScene', 'scene/' + this._name + '.json');
    }
    
    //执行
    _.Scene.prototype.exFun= function(eve){
        switch (eve[0]) {
            case -2:
            case "#heap":
                switch (eve[2]){
                    case "arr":
                        this._heap[eve[1]]=[]
                        for(let i=3;i<eve.length;i++)
                            this._heap[eve[1]].push(this.getVal(eve[i]))
                        break
                    case "obj":
                        this._heap[eve[1]]={}
                        if(eve.length%2===1)
                            for(let i=3;i<eve.length;i+=2){
                                let key=this.getVal(eve[i])
                                this._heap[eve[1]][key]=this.getVal(eve[i+1])
                            }
                        break
                }
                break


            case 0:
            case "#data":
                this._data=LIM.ENTITY.Scene()
                break
            case 11:
            case "#pushBit":
                this._data.bit[eve[1]]=this.getVal(eve[2])
                break

            case 21:
            case "#pushVes":
                this._data.vessel[eve[1]]=LIM.ENTITY.Vessel()
                break
            case 22:
            case "#portVes":
                this._data.vessel[eve[1]][eve[2]]=this.getVal(eve[3])
                break


            case 31:
            case "#pushWin":
                this._data.window[eve[1]]=LIM.ENTITY.Vessel()
                break
            case 32:
            case "#portWin":
                this._data.window[eve[1]][eve[2]]=this.getVal(eve[3])
                break

            case 41:
            case "#pushCom":
                this._data.command[eve[1]]=LIM.ENTITY.Command()
                break
            case 42:
            case "#portCom":
                this._data.command[eve[1]][eve[2]]=this.getVal(eve[3])
                break

            case 51:
            case "#pushSha":
                this._data.shape[eve[1]]=LIM.ENTITY.Shape()
                break
            case 52:
            case "#portSha":
                this._data.shape[eve[1]][eve[2]]=this.getVal(eve[3])
                break


            case 61:
            case "#pushWav":
                this._data.wave[eve[1]]=LIM.ENTITY.Shape()
                break
            case 62:
            case "#portWav":
                this._data.wave[eve[1]][eve[2]]=this.getVal(eve[3])
                break

            case 71:
            case "#pushFic":
                this._data.fica[eve[1]]=LIM.ENTITY.Shape()
                break
            case 72:
            case "#portFic":
                this._data.fica[eve[1]][eve[2]]=this.getVal(eve[3])
                break


            case 81:
            case "#pushSou":
                this._data.sound[eve[1]]=LIM.ENTITY.Sound()
                break
            case 82:
            case "#portSou":
                this._data.sound[eve[1]][eve[2]]=this.getVal(eve[3])
                break
            case 83:
            case "#confSou":
                this._data.sound[eve[1]].config[eve[2]]=this.getVal(eve[3])
                break
            case 84:
            case "#addEffect":
                this._data.sound[eve[1]].effect[eve[2]]=LIM.ENTITY.SoundEffect()
                break
            case 85:
            case "#portEffect":
                this._data.sound[eve[1]].effect[eve[2]][eve[3]]=this.getVal(eve[4])
                break


            case 91:
            case "#pushTxt":
                this._data.text[eve[1]]=LIM.ENTITY.Text()
                break
            case 92:
            case "#portTxt":
                this._data.text[eve[1]][eve[2]]=this.getVal(eve[3])
                break

            case 100:
            case "#pushGro":
                this._data.group[eve[2]]=this.getVal(eve[1])
                break
            case 110:
            case "#pushFil":
                this._data.filter[eve[1]]=LIM.ENTITY.SceneFilter()
                break
            case 111:
            case "#portFil":
                this._data.filter[eve[1]][eve[2]]=this.getVal(eve[3])
                break
            case 112:
            case "#uniFil":
                this._data.filter[eve[1]].uniforms[eve[2]]=this.getVal(eve[3])
                break


            case 120:
            case "#pushEff":
                this._data.effector[eve[1]]=LIM.ENTITY.Effector()
                break
            case 121:
            case "#portEff":
                this._data.effector[eve[1]][eve[2]]=this.getVal(eve[3])
                break

            case 500:
            case "#run":
                if(eve[1]) this._item[eve[1]].setRun(parseInt(eve[2]),!eve[3])
                else  this.setRun(parseInt(eve[2]),!eve[3])
                break
        }
    }



    _.Scene.prototype.run = function() {
        this._time = 0;
        this._load = 1;
        this._run = 0b111111;
    };
    _.Scene.prototype.update = function () {
        if(this.isLoad())
            switch (this._load) {
                case -1:
                    this.DataLoaded();
                    break;
                case 0:
                    this.run()
                    break;
                default:
                    this.refresh();
            }
        else this.checkFont()
    }
    _.Scene.prototype.refresh = function() {
        this._time++
        if(this._time===1)
        {
            this.createFilter()
            this.a=new Sprite(this._bit["t"])
            this.addChild(this.a)
            this.openEdi()
        }
        if(this.isRun(0)) {for(let item of this.children) item.update();}

        let key = this.updateFilter()[1]
        if(key!==this._filkey) {
            this._filkey.key
            let s = key.split(":").slice(1)
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
            }
        }
    }
    
    
    _.Scene.prototype.updateFilter = function () {
        return this._filter.updateFilter()
    }
    _.Scene.prototype.createFilter = function () {
        for(let key in this._data.filter)
            this._filter.createFilter(key,this._data.filter[key])
    }
    
    
    //已加载
    _.Scene.prototype.DataLoaded = function () {
        if ($dataScene){
            this._data=$dataScene
            for(let key in this._data.bit) this.loadBit(key,this._data.bit[key])
            for (let key in this._data.text) this.loadFont(this._data.text[key].content);
            this._load = 0;
        }
    }


    _.Scene.prototype.openEdi = function () {
        let parameter = JSON.stringify($dataScene)
        let encodedParameter = encodeURIComponent(parameter);
        let base = require('path').dirname(process.mainModule.filename);
        let url = base+"/data/scene/test/edi.html?param=" + encodedParameter;
        let win= window.open(url,"edi");
    }
    
    _.Scene.prototype.loadBit = function (key,val) {
        this._bitload.push(key)
        this._bit[key] =ImageManager.loadBitmap(val[0],val[1],val[2],val[3])
        this._bit[key].addLoadListener(function () {this._bitload.splice(this._bitload.indexOf(key),1)}.bind(this));
    }
    _.Scene.prototype.loadFont = function (val) {
        this._word[val] = null;
        let file = val.split("_");
        if (!this._txt[file[0]]) {
            this._txt[file[0]] = { data: null, load: 0 };
            DataManager.loadDataFile(file[0], 'text/' + file[0] + '.json', this._txt);
        }
        else  this._txt[file[0]].load=1
    }
    _.Scene.prototype.checkFont=function (){
        for (let key in this._txt)
            if (this._txt[key].load === 1) {
                let data = this._txt[key].data;
                for (let key in data) {
                    let arr = data[key].arr;
                    for (let p of arr) {
                        if (p[0] == "@") {
                            p = p.slice(1);
                            this.loadFont(p);
                        }
                    }
                }
                this._txt[key].load = 2
            }
        this.setFont()
    }
    _.Scene.prototype.setFont=function (){
        let load = Object.values(this._txt).every(item => item.data !== null)
        if(load){
            for(let key in this._word) {
                let q=key.split("_")[0]
                this._word[key] = this._txt[q].data[key]
            }
            Object.values(this._txt).forEach(obj => obj.load = 3);
        }
    }

    _.Scene.prototype.isLoad =function (){
        return (!this._bitload.length)&&Object.values(this._txt).every(item => item.load === 3);
    }

    _.Scene.prototype.isRun=function(bit){
        return LIM.UTILS.atBit(this._run,bit)
    }
    _.Scene.prototype.setRun=function(bit,bool){
        this._run = LIM.UTILS.setBit(this._run,bit,bool);
    }

})(LIM.SCENE);