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
        this._lock=false
        this.startRunning();
        Scene_Base.prototype.initialize.call(this);
    }
    //开始运行
    _.Scene.prototype.startRunning = function () {
        this.children=[]
        
        this._load = -1
        this._filkey=""
        this._run = 0;
        this._time = 0;
        this._bitload =[]
        this._data={}
        this._item = {}
        this._bit ={}
        this._txt ={}
        this._word={}
        this._filter=new LIM.SCENE.Filter()
        DataManager.loadDataFile('$dataScene', 'scene/' + this._name + '.json');
    }
    //触发器
    _.Scene.prototype.effector=function(){
        for(let key in this._data.effector) {
            if (this._data.effector[key].count === 1 && this.judge(this._data.effector[key].judge)) {
                this._data.effector[key].count++
                this.triggerHandler(this._data.effector[key].com)
            }
        }
    }
    _.Scene.prototype.judge=function (judge){
        switch (judge[0]){
            case "%":return LIM.EVENT[judge.slice(1)]()
        }
    }
    _.Scene.prototype.playSound=function (id){
        if(this._data.sound&&this._data.sound[id]) {
            let sound=this._data.sound[id]
            Conductor.start(sound)
        }
    }
    
    //执行
    _.Scene.prototype.triggerHandler=function(com,data) {
        if(!com||this._lock) return
        let handler=this._data.handler[com]
        if(handler) this.exCom(handler,data)
    }
    _.Scene.prototype.exCom=function(parser,data){
        for(let token of parser) {
            if(data) token=token.replacePlace(data)
            if (token[0] === "%")
            {
                let fun=token.slice(1)
                if(LIM.EVENT[fun]) LIM.EVENT[fun]()
            }
            else if (token[0] === "#") this.exFun(token.split(":"))
            else {
                this.triggerHandler(token)
            }
        }
    }
    _.Scene.prototype.exFun= function(eve){
        switch (eve[0]) {
            case "#activa":
                if(this._item[eve[1]])
                    this._item[eve[1]]._com.acti = true
                break
            case "#close":
                if(this._item[eve[1]])
                    this._item[eve[1]]._com.acti = false
                break
            case "#mode":
                if(this._item[eve[1]]) {
                    this._item[eve[1]]._com.next = eve[2]
                }
                break
            case "#sound":
                this.playSound(eve[1]);break
            case "#add_effector":
                if(this._data.effector[eve[1]])
                    this._data.effector[eve[1]].count++
                break
            case "#zero_effector":
                if(this._data.effector[eve[1]])
                    this._data.effector[eve[1]].count=0
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
        this._lock=this.refreshFilter()
        if(!this._lock) {
            if (this.isRun(2)) this.createItem()
            if (this.isRun(1)) this.showItem();
            if (this.isRun(0)) for (let item of this.children) item.update();
            if (this.isRun(3)) this.effector()
            if (this.isRun(4)) this.createFilter()
        }
    }
    _.Scene.prototype.createItem = function () {
        if(this.isRun(2)) {this.setRun(2,false)}
        this._item = {}
        this.createVessel();
        this.createWindow();
        this.createCommand();
        this.createShape()
        this.createWave();
        this.createFractal();
    }
    _.Scene.prototype.getText = function (key) {
        if(this._data.text[key]){
            let item = this._data.text[key]
            let content=this.getContent(this._word[item.content])[0]
            return [content,item]
        }
        return null;
    }
    _.Scene.prototype.getContent=function(text){
        if(text.arr&&text.arr.length) {
            let arr=[]
            for(let item of text.arr) arr.push(item)
            for (let i = 0; i < arr.length; i++)
                if (arr[i][0] === "@"){
                    let cont = this.getContent(this._word[arr[i].splice(0, 1)])
                    arr[i]=cont[0]
                }
                else if (arr[i][0] === "#") {
                    let num =arr[i].splice(0, 1)
                    arr[i] = LIM.$number.get(num)
                }
            let str = text.text.replacePlace(arr)
            return [str]
        }
        return [text.text]
    }
    
    _.Scene.prototype.showItem = function() {
        if(this.isRun(1)) {this.setRun(1,false)}
        this.children=[]
        let arr=[]
        for(let key in this._item) arr.push({key:key,index:this._item[key]._index||0})
        arr.sort(LIM.UTILS.sortBy("index",false))
        
        for(let item in this._data.group){
            if(this._item[this._data.group[item]])
                this._item[this._data.group[item]].children=[]
        }
        for(let item of arr)
            if(this._item[item.key]) {
                if(this._data.group[item.key]&&this._item[this._data.group[item.key]]){
                    let pant=this._item[this._data.group[item.key]]
                    let index=item.index
                    if(pant.children.length)
                        for(let i=0;i<pant.children.length;i++){
                            if(pant.children[i]._com) if(index<pant.children[i]._com.index) {pant.addChildAt(this._item[item.key],i);i=pant.children.length}
                            else if(i===pant.children.length-1)pant.addChild(this._item[item.key])
                        }
                    else pant.addChild(this._item[item.key])
                }
                else this.addChild(this._item[item.key])
            }
    }
    _.Scene.prototype.createVessel = function () {
        if(this._data.vessel) {
            for(let key in this._data.vessel) {
                let item = this._data.vessel[key]
                let name = 'v_' + key
                this._item[name] = new LIM.SCENE.Vessel(this, name, item)
            }
        }
    }
    _.Scene.prototype.createWindow = function () {
        if(this._data.window) {
            for(let key in this._data.window) {
                let item = this._data.window[key]
                let name = 'w_' + key
                this._item[name] = new LIM.SCENE.Window(this, name, item)
            }
        }
    }

    _.Scene.prototype.createCommand = function () {
        if(this._data.command) {
            for(let key in this._data.command) {
                let item = this._data.command[key]
                let name = 'c_' + key
                this._item[name] = new LIM.SCENE.Command(this, name, item)
            }
        }
    }
    
    _.Scene.prototype.createShape  = function () {
        if(this._data.shape) {
            for(let key in this._data.shape) {
                let item = this._data.shape[key]
                let name = 's_' + key
                this._item[name] = new LIM.SCENE.Shape(this, name, item)
            }
        }
    }
    _.Scene.prototype.createFractal = function () {
        if(this._data.fica) {
            for(let key in this._data.fica) {
                let item = this._data.fica[key]
                let name = 'f_' + key
                this._item[name] = new LIM.SCENE.Fractal(this, name, item)
            }
        }
    }
    _.Scene.prototype.createWave = function () {
        if(this._data.wave) {
            for(let key in this._data.wave) {
                let item = this._data.wave[key]
                let name = 'a_' + key
                this._item[name] = new LIM.SCENE.Wave(this, name, item)
            }
        }
    }
    
    _.Scene.prototype.refreshFilter =function (){
        let data = this.updateFilter()
        if(data[1]!==this._filkey) {
            this._filkey.key
            let s = data[1].split(":").slice(1)
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
                case 3:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app, 
                                    this._filter.filter[s[2]].app];
                    break
                case 4:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app, 
                                    this._filter.filter[s[2]].app, this._filter.filter[s[3]].app];
                    break
                case 5:
                    this.filters =  [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                                     this._filter.filter[s[2]].app, this._filter.filter[s[3]].app, this._filter.filter[s[4]].app];
                    break
                case 6:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,this._filter.filter[s[2]].app, 
                                    this._filter.filter[s[3]].app, this._filter.filter[s[4]].app,this._filter.filter[s[5]].app];
                    break
                case 7:
                    this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                                    this._filter.filter[s[2]].app, this._filter.filter[s[3]].app, 
                                    this._filter.filter[s[4]].app, this._filter.filter[s[5]].app,this._filter.filter[s[5]].app];
                    break
            }
        }
        if(data[2])  this.triggerHandler(data[2])
        return data[0]
    }
    _.Scene.prototype.updateFilter = function () {
        return this._filter.updateFilter()
    }
    _.Scene.prototype.createFilter = function () {
        if (this.isRun(4)) {this.setRun(4, false)}
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
    
    _.Scene.prototype.loadBit = function (key,val) {
        this._bitload.push(key)
        this._bit[key] =ImageManager.loadBitmap(val[0],val[1],val[2],val[3])
        this._bit[key].addLoadListener(function () {
            this._bit[key].adjustTone(val[4]||0,val[5]||0,val[6]||0)
            this._bitload.splice(this._bitload.indexOf(key),1)
        }.bind(this));
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
                        if (p[0] === "@") {
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
    _.Scene.prototype.getBit = function (key) {
        if(this._bit[key]) {
            return this._bit[key];
        } else {
            return null;
        }
    }

})(LIM.SCENE);