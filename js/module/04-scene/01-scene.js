var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};

(function(_) {

    _.Scene = function () { this.initialize.apply(this, arguments) }
    _.Scene.prototype = Object.create(Scene_Base.prototype);
    _.Scene.prototype.constructor = _.Scene;

    _.Scene.prototype.initialize = function (name) {
        this._run = 0
        this._lock=false
        this._load = -5
        this._bit = {}
        this._word = {}
        this._filter={}
        $dataScene=null
        DataManager.loadDataFile('$dataScene', 'scene/' + name + '.json');
        Scene_Base.prototype.initialize.call(this);
    }
    _.Scene.prototype.update = function () {
        this._lock=this.updateFilter()
        LIM.$story.time++
        switch (this._load) {
            case -5:
                this.checkDataLoaded();
                break;
            case -4:
                this.loadResources();
                break;
            case -3:
                this.checkResourcesLoaded();
                break;
            case -2:
                this.readyLoadFont();
                break;
            case -1:
                this.checkFont();
                break;
            case 0:
                break;
            default:
                this.refresh();
        }
    }
    
    _.Scene.prototype.run = function() {
        this._time = 0;
        this._load = 1;
        this._run = 0b11111;
    };
    
    _.Scene.prototype.refresh = function(){
        if(this.isRun(2)) this.createItem();
        if(this.isRun(1)) this.showItem();
        if(this.isRun(0)) for(let item of this.children) item.update();
        if(this.isRun(3)) this.effector()
        if(this.isRun(4)) this.createFilter();
        this._time++
    }
    _.Scene.prototype.createItem = function () {
        if(this.isRun(2)) {this.setRun(2,false)}
        this._item = {}
        this.createVessel();
        this.createWindow();
        this.createCommand();
        this.createShape();
    }

    
    _.Scene.prototype.createFilter = function () {
        if (this.isRun(4)) {
            this.setRun(4, false)
        }
        this._filter={}
        for (let key in this._data.filter) {
            let data=this._data.filter[key]
            if (data.acti) {
                this._filter[key] = {data: data, obj: LIM.Filter(data.type),time:this._time}
                for(let uniforms in data.uniforms){
                    let src=uniforms.split(".")
                    let d1= this._filter[key].obj
                    let d2= this._filter[key].obj.uniforms
                    for(let i=0;i<src.length;i++){
                        if(i==src.length-1) {
                            if(d1) d1[src[i]]= data.uniforms[uniforms]
                            if(d2) d2[src[i]]= data.uniforms[uniforms]
                        }
                        else {
                            if(d1) d1=d1[src[i]];
                            if(d2) d2=d2[src[i]]}
                        
                    }
                }
            }
        }
        this.showFilter()
    }
    _.Scene.prototype.showFilter = function () {
        let key=Object.keys(this._filter)
        switch (key.length){
            case 0:this.filters=[]
                break
            case 1:
                this.filters=[this._filter[key[0]].obj]
                break
            case 2:
                this.filters=[this._filter[key[0]].obj,this._filter[key[1]].obj]
                break
        }
        this.updateFilter()
    }
    _.Scene.prototype.updateFilter= function (){
        let bool=false
        let destroy=false
        for(let key in this._filter){
            let filter = this._filter[key]
            bool=bool||filter.data.cease
            let time=this._time-filter.time
            let data=LIM.UTILS.countWave(filter.data.wave,[100,time],filter.obj.uniforms)
            for(let uniforms in data){
                let src=uniforms.split(".")
                let d1= this._filter[key].obj
                let d2= this._filter[key].obj.uniforms
                for(let i=0;i<src.length;i++){
                    if(i==src.length-1) {
                        if(d1) d1[src[i]]= data[uniforms]
                        if(d2) d2[src[i]]= data[uniforms]
                    }
                    else {
                        if(d1) d1=d1[src[i]];
                        if(d2) d2=d2[src[i]]}
                }
            }
            if(filter.data.cycle>0&&time>filter.data.cycle){
                filter.data.acti=false
                delete this._filter[key]
                this._lock=false
                if(filter.data.comE) this.triggerHandler(filter.data.comE)
                destroy=true
            }
        }
        if(destroy)  this.showFilter()
        return bool
    }
    _.Scene.prototype.actiFilter= function (key,bool){
        this.setRun(4, true)
        this._data.filter[key].acti=bool=="1"?true:false
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
    _.Scene.prototype.createShape = function () {
        if(this._data.shape) {
            for(let key in this._data.shape) {
                let item = this._data.shape[key]
                let name = 's_' + key
                this._item[name] = new LIM.SCENE.Shape(this, name, item)
            }
        }
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
                if (arr[i][0] == "@"){
                    let cont = this.getContent(this._word[arr[i].splice(0, 1)])
                    arr[i]=cont[0]
                }
                else if (arr[i][0] == "#") {
                    let num =arr[i].splice(0, 1)
                    arr[i] = LIM.$number.get(num)
                }
            let str = text.text.replacePlace(arr)
            return [str]
        }
        return [text.text]
    }
    
    _.Scene.prototype.showItem = function() {
        if(this.isRun(1)) {
            this.setRun(1,false)
        }
        this.children=[]
        let arr=[]
        for(let key in this._item)
            arr.push({key:key,index:this._item[key]._index||0})
        arr.sort(LIM.UTILS.sortBy("index",false))
        for(let item of arr)
            if(this._item[item.key]) {
                if(this._data.group[item.key]&&this._item[this._data.group[item.key]]){
                    let pant=this._item[this._data.group[item.key]]
                    let index=item.index
                    if(pant.children.length)
                        for(let i=0;i<pant.children.length;i++){
                            if(pant.children[i]._com) if(index<pant.children[i]._com.index) {pant.addChildAt(this._item[item.key],i);i=pant.children.length}
                            else if(i==pant.children.length-1)pant.addChild(this._item[item.key])
                        }
                    else pant.addChild(this._item[item.key])
                }
                else this.addChild(this._item[item.key])
            }
    }
    
    //触发器
    _.Scene.prototype.effector=function(){
        for(let key in this._data.effector)
            if (this._data.effector[key].count === 1 && this.judge(this._data.effector[key].judge)) {
                this._data.effector[key].count++
                this.triggerHandler(this._data.effector[key].com)
            }
    }
    _.Scene.prototype.judge=function (judge){
        switch (judge[0]){
            case "%":return LIM.EVENT[judge.slice(1)]()
        }
    }
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
            else if (token[0] == "#") this.exFun(token.split(":"))
            else  this.triggerHandler(token)
        }
    }
    _.Scene.prototype.exFun=function(eve){
          switch (eve[0]) {
            case "#mode":
                if(this._item[eve[1]])
                    this._item[eve[1]]._com.next = eve[2]
                break
            case "#activa":
                if(this._item[eve[1]])
                    this._item[eve[1]]._com.acti = true
                break
            case "#sleep":
                 if(this._item[eve[1]])
                     this._item[eve[1]]._com.acti = false
                 break    
            case "#on_effector":
                if(this._data.effector[eve[1]])
                    this._data.effector[eve[1]].count++
                break
            case "#off_effector":
                if(this._data.effector[eve[1]])
                    this._data.effector[eve[1]].count=0
                break
           case "#whell":
               if(this._item[eve[1]]&&this._item[eve[1]] instanceof _.Command)
                   this._item[eve[1]].topRow(eve[2])
               break
           case "#select":
               if(this._item[eve[1]]&&this._item[eve[1]] instanceof _.Command)
                   this._item[eve[1]].select(eve[2])
               break
           case "#filter":
               if(eve[1]==="this") this.actiFilter(eve[2],eve[3])
               break
        }
    }

    _.Scene.prototype.checkDataLoaded = function () {
        if ($dataScene){
            this._data = $dataScene;
            this._load = -4;
        }
    }
    _.Scene.prototype.readyLoadFont = function () {
        this._load = -1;
        this._loadFont = {};
        for (let key in this._data.text)
            this.loadFontIfNeeded(this._data.text[key].content);
    }
    _.Scene.prototype.loadFont = function (file) {
        this._loadFont[file] = { data: null, load: 0 };
        DataManager.loadDataFile(file, 'text/' + file + '.json', this._loadFont);
    }
    _.Scene.prototype.loadFontIfNeeded = function (file) {
        this._word[file] = null;
        file = file.split("_")[0];
        if (!this._loadFont[file]) this.loadFont(file);
    }
    _.Scene.prototype.checkFont = function () {
        for (let key in this._loadFont)
            if (this._loadFont[key].load == 1) {
                let data = this._loadFont[key].data;
                for (let key in data) {
                    let arr = data[key].arr;
                    for (let p of arr) {
                        if (p[0] == "@") {
                            p = p.slice(1);
                            this.loadFontIfNeeded(p);
                        }
                    }
                }
                this._loadFont[key].load = 2;
            }
        let allTextLoaded = Object.values(this._loadFont).every(item => item.load == 2);
        if (allTextLoaded) {
            for(let key in this._word)
                this._word[key]=this._loadFont[key.split("_")[0]].data[key]
            delete this._loadFont
            this.run();}
    }

    _.Scene.prototype.loadResources = function () {
        if(this._data.bit) {
            this._bitload=0
            for (let key in this._data.bit) {
                this._bitload++
                let item=this._data.bit[key]
                this._bit[key] = ImageManager.loadBitmap(item[0],item[1],item[2],item[3])
                this._bit[key].addLoadListener(function () {
                    this._bitload--}.bind(this));
            }
            this._load=-3
        }
        else this.run()
    }
    _.Scene.prototype.checkResourcesLoaded = function () {
        if(this._bitload == 0) this._load = -2;
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
    //滤镜
})(LIM.SCENE);