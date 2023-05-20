var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};

(function(_) {

    _.Scene = function () { this.initialize.apply(this, arguments) }
    _.Scene.prototype = Object.create(Scene_Base.prototype);
    _.Scene.prototype.constructor = _.Scene;

    _.Scene.prototype.initialize = function (name) {
        this._run = 0
        this._load = -5
        this._bit = {}
        this._font = {}
        DataManager.loadDataFile('$dataScene', 'scene/' + name + '.json');
        Scene_Base.prototype.initialize.call(this);
    }
    _.Scene.prototype.update = function () {
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
        this._run = 0b111;
    };
    _.Scene.prototype.refresh = function(){
        if(this.isRun(2)) {
            this.createItem();
        }
        if(this.isRun(1)) {
            this.showItem();
        }
        if(this.isRun(0)) {
            for(let item of this.children)
                item.update();
        }
        this._time++
    }

    _.Scene.prototype.createItem = function () {
        if(this.isRun(2)) {
            this.setRun(2,false)
        }
        this._item = {}
        this._text = {}
        this.createVessel();
        this.createWindow();
        this.createCommand();
        this.createShape();
        this.createText();
    }
    _.Scene.prototype.createVessel = function () {
        if(this._data.vessel) {
            for(let key of Object.keys(this._data.vessel)) {
                let item = this._data.vessel[key]
                let name = 'v_' + key
                this._item[name] = new LIM.SCENE.Vessel(this, name, item)
            }
        }
    }
    _.Scene.prototype.createWindow = function () {
        if(this._data.window) {
            for(let key of Object.keys(this._data.window)) {
                let item = this._data.window[key]
                let name = 'w_' + key
                this._item[name] = new LIM.SCENE.Window(this, name, item)
            }
        }
    }
    _.Scene.prototype.createCommand = function () {
        if(this._data.command) {
            for(let key of Object.keys(this._data.command)) {
                let item = this._data.command[key]
                let name = 'c_' + key
                this._item[name] = new LIM.SCENE.Command(this, name, item)
            }
        }
    }
    _.Scene.prototype.createText = function () {
        if(this._data.text){
            for(let key of Object.keys(this._data.text)) {
                let item = this._data.text[key]
                var bitmap = new Bitmap(0,0);
                bitmap.fontSize = item.fontSize;
                bitmap.fontFace = 'GameFont';
                bitmap.textColor=item.textColor
                bitmap.outlineWidth = item.outlineWidth;
                bitmap.outlineColor = item.outlineColor;
                bitmap.fontItalic = item.fontItalic;
                let content=this.getContent(this._font[item.content])
                this._font[item.content].text.replacePlace(this._font[item.content].arr)

                let width=bitmap.measureTextWidth(content)
                bitmap._createCanvas(width,item.fontSize)
                bitmap.drawText(content, 0, 0, width,item.fontSize,'center')
                this._text[key] = bitmap;
            }
        }
    }
    _.Scene.prototype.getContent=function(text){
        let arr=text.arr
        for(let i=0;i<arr.length;i++)
            if(arr[i][0]=="@")
                arr[i]=this.getContent(this._font[arr[i].splice(0,1)])
        let str=text.text.replacePlace(text.arr)
        return str
    }
    _.Scene.prototype.createShape = function () {
        if(this._data.shape) {
            for(let key of Object.keys(this._data.shape)) {
                let item = this._data.shape[key]
                let name = 's_' + key
                this._item[name] = new LIM.SCENE.Shape(this, name, item)
            }
        }
    }



    _.Scene.prototype.showItem = function() {
        if(this.isRun(1)) {
            this.setRun(1,false)
        }
        this.children=[]
        let arr=[]
        for(let key of Object.keys(this._item))
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
    _.Scene.prototype.triggerFun=function(eve){
        for(let item of eve)
            if(item[0]=="#")
                this.exFun(item.split(":"))
            else {}
    }
    _.Scene.prototype.exFun=function(eve){
        switch (eve[0]) {
            case "#mode":
                if(this._item[eve[1]]) {
                    this._item[eve[1]]._com.next = eve[2]
                    break
                }
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
        for (let key of Object.keys(this._data.text))
            this.loadFontIfNeeded(this._data.text[key].content);
    }
    _.Scene.prototype.loadFont = function (file) {
        this._loadFont[file] = { data: null, load: 0 };
        DataManager.loadDataFile(file, 'text/' + file + '.json', this._loadFont);
    }
    _.Scene.prototype.loadFontIfNeeded = function (file) {
        this._font[file] = null;
        file = file.split("_")[0];
        if (!this._loadFont[file]) this.loadFont(file);
    }
    _.Scene.prototype.checkFont = function () {
        for (let key of Object.keys(this._loadFont))
            if (this._loadFont[key].load == 1) {
                let data = this._loadFont[key].data;
                for (let key of Object.keys(data)) {
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
            for(let key of Object.keys(this._font))
                this._font[key]=this._loadFont[key.split("_")[0]].data[key]
            delete this._loadFont
            this.run();}
    }

    _.Scene.prototype.loadResources = function () {
        if(this._data.bit) {
            this._bitload=0
            for (let key of Object.keys(this._data.bit)) {
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
})(LIM.SCENE);