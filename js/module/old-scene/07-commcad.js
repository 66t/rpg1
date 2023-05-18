var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){

    _.Commcad=function(){this.initialize.apply(this,arguments)}
    _.Commcad.prototype = Object.create(_.Window.prototype)
    _.Commcad.prototype.constructor = _.Commcad;
    _.Commcad.prototype.initialize = function (origin,com) {
        _.Window.prototype.initialize.call(this,origin,com);
    }
    _.Commcad.prototype.draw=function(){
        _.Window.prototype.draw.call(this);
        if(this._data.ont&&this._data.list) {
            for(let list of this._data.list){
                let mode = this.itemMode(list.ont)
                console.log(this.itemRect(list.ont,mode))
            }
            let bit = this._origin.getBit(this._data.cutImage.bit)
        }
    }

    _.Commcad.prototype.itemMode = function(name) {
        let select = 0
        for(let item of Object.keys(this._data.relation[name]))
            if(this._data.relation[name][item][0]==="=")
                if(this._data.relation[name][item].slice(1)==this._com.select)
                    select=item
        return select
    }
    _.Commcad.prototype.itemRect = function(name,mode) {
        let rect = new Rectangle();
        if(!this._data.ont[name][mode]) mode=0
        rect.x = this._data.padding[0]+this._data.ont[name][mode].x
        rect.y = this._data.padding[1]+this._data.ont[name][mode].y
        rect.width = (this._data.ont[name][mode].img.x2-this._data.ont[name][mode].img.x1)+
            (this._data.ont[name][mode].img.x4-this._data.ont[name][mode].img.x3)+
            (this._data.ont[name][mode].img.x3-this._data.ont[name][mode].img.x2)*this._data.ont[name][mode].size[0]
        rect.height = (this._data.ont[name][mode].img.y2-this._data.ont[name][mode].img.y1)+
            (this._data.ont[name][mode].img.y4-this._data.ont[name][mode].img.y3)+
            (this._data.ont[name][mode].img.y3-this._data.ont[name][mode].img.y2)*this._data.ont[name][mode].size[1]
        return rect;
    };


})(LIM.SCENE);