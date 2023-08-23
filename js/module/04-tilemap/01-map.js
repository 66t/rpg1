//===========================
// @-01-map
// @Path      js/module/04-tilemap
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/8/23)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.TILEMAP=LIM.TILEMAP||{};

((_)=> {
    _.Map = function () { this.initialize.apply(this, arguments) }
    _.Map.prototype = Object.create(Scene_Base.prototype);
    _.Map.prototype.constructor = _.Map;
    _.Map.prototype.initialize = function (name) {
        this._name=name
        this._lock=false
       
        this.startRunning();
        Scene_Base.prototype.initialize.call(this);
    }

    //开始运行
    _.Map.prototype.startRunning = function () {
        this._mapArr=[]
        this._bitload =[]
        this._bit ={}
        this._load = -1
        
        DataManager.loadDataFile('5', 'map/MAP_' + this._name + '.json',this._mapArr);
        let data=$dataLink[this._name]
        for(let i=0;i<10;i++)
         if(data[i]) DataManager.loadDataFile(i, 'map/MAP_' + data[i] + '.json',this._mapArr);
         else this._mapArr[i]={load:1}
    }
    
    _.Map.prototype.update = function () {
        if(this.isLoad())
            switch (this._load) {
                case -1:
                    this.DataLoaded();
                    break;
                case 0:
                    this.BitLoaded();
                    break;
                case 1:
                    this.refresh();
                    break;
            }
    }

    _.Map.prototype.DataLoaded = function () {
        if(this._mapArr.filter((item)=>{return !item.load}).length===0)
            this._load = 0
    }
    _.Map.prototype.BitLoaded = function () {
        console.log(this._mapArr)
        for(let key in this._data.bit) this.loadBit(key,this._data.bit[key])
        this._load = 1
    }
    _.Map.prototype.loadBit = function (key,val) {
        this._bitload.push(key)
        this._bit[key] =ImageManager.loadBitmap(val[0],val[1],val[2],val[3])
        this._bit[key].addLoadListener(function () {
            this._bit[key].adjustTone(val[4]||0,val[5]||0,val[6]||0)
            this._bitload.splice(this._bitload.indexOf(key),1)
        }.bind(this));
    }
    _.Map.prototype.isLoad =function (){
        return !this._bitload.length
    }
})(LIM.TILEMAP);