/*LIM.SCENE.Shape - RPG Maker MV图形处理对象
作者：LIM

这是一个用来处理图形类的对象，类似于RPG Maker MV中的Sprite对象。
该对象继承自Sprite对象，并实现了一些额外的功能，如图形的形态变化、动作表演、滤镜等效果。

包含的方法和功能：

initialize - 对象的初始化方法。
setAction - 设置当前需要执行的动作，并将该动作添加到动作执行队列中。
executeAction - 执行当前的动作。
draw - 绘制位图，生成图像。
bit - 生成图像的过程。
shape - 改变图像的形态，包括位置、旋转、缩放等。
render - 着色，改变图像的色调和混合颜色。
contFilter - 应用滤镜，根据当前动作和预设数据应用相应的滤镜。
filter - 根据传入的数据应用相应的滤镜。
update - 图形的更新方法。*/
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Shape=function(){this.initialize.apply(this,arguments)}
    _.Shape.prototype = Object.create(Sprite.prototype);
    _.Shape.prototype.constructor = _.Shape;

    //初始化
    _.Shape.prototype.initialize = function (origin,com) {
        this._dar=[]
        this._buf=null
        this._pic=null
        this._com=com
        this._origin=origin
        Sprite.prototype.initialize.call(this);
        this.filters=[]
    }
    //载入动作
    _.Shape.prototype.setAction=function() {
        if(this._com.next!==this._com.mode){
            if(this._com.option[this._com.next]) {
                let act = this._com.action[this._com.mode + "_" + this._com.next] || this._com.action['default']
                this._com.execute.push({or:this._com.mode,ta: this._com.next,time:0,action:act})
            }
            this._com.next=this._com.mode
        }
        else if(this._com.execute.length===0&&this._com.loop){
            this._com.next=this._com.mode
            let act = this._com.action[this._com.mode]||this._com.action['default']
            this._com.execute.push({or:this._com.mode,ta:this._com.next,time:0,action:act})
        }

    }
    //执行动作
    _.Shape.prototype.executeAction=function(){
        if(this._com.execute.length===0) return

        this._com.execute[0].time++
        //改变
        if(this._com.execute[0].time===this._com.execute[0].action.change) {
            this._com.run*=5;
            if(this._com.execute[0].action.fun1) this._origin.triggerFun(this._com.execute[0].action.fun1)
            let o=this._com.option[this._com.mode]
            this._com.mode=this._com.execute[0].ta;
            let n=this._com.option[this._com.mode]
            if(n.self) {
                n.x = o.x;
                n.y = o.y;
                n.w = o.w;
                n.h = o.h;
                n.alpha = o.alpha;
                n.rota = o.rota;
            }
            this._com.next=this._com.mode
        }
        //结束
        if(this._com.execute[0].time>this._com.execute[0].action.frame){
            if(!this._com.execute[0].action.filter2.end&&this.filters[0]) this.filters[0].enabled=false
            if(this._com.execute[0].action.fun2) this._origin.triggerFun(this._com.execute[0].action.fun2)
            this._com.execute.splice(0,1)
        }
        else if(this._com.execute[0].time<=this._com.execute[0].action.change||(this._com.execute[0].time>this._com.execute[0].action.change)){
            let anime=this._com.execute[0].time<this._com.execute[0].action.change?
                this._com.execute[0].action.anime1:this._com.execute[0].action.anime2

            let r=this._com.execute[0].time<this._com.execute[0].action.change?
                {time:this._com.execute[0].action.change,change:this._com.execute[0].time}:
                {time:this._com.execute[0].action.frame-this._com.execute[0].action.change,change:this._com.execute[0].time-this._com.execute[0].action.change}
            if(anime) {
                this._com.run *= 3
                for (let key of Object.keys(anime)) {
                    if (typeof anime[key] == 'object') {
                        let v = 0
                        for (let item of anime[key]) {
                            let x = LIM.UTILS.waveNum(item.wave, r.time / (1 + item.wa * 2), r.change)
                            x = LIM.UTILS.lengthNum(item.min) + (LIM.UTILS.lengthNum(item.max) - LIM.UTILS.lengthNum(item.min)) * x
                            if (item.mode == 1) v*=x
                            else v += x
                        }
                        this._com.option[this._com.mode][key] = v
                    } else this._com.option[this._com.mode][key] += anime[key]
                }

            }
            let filter=this._com.execute[0].time<this._com.execute[0].action.change?this._com.execute[0].action.filter1:this._com.execute[0].action.filter2
            if(filter.type) {
                let data = {type: filter.type,data:{},hook:{}}
                r = LIM.UTILS.waveNum(filter.wave, r.time / (1 + filter.wa * 2), r.change)
                for (let key of Object.keys(filter.data)) {
                    if(key.split("%").length>1){
                        let str=key.split("%")
                        if(!data.data[str[0]]) data.data[str[0]]=[]
                        data.data[str[0]][str[1]]=parseFloat(LIM.UTILS.lengthNum(filter.data[key][0]) + (LIM.UTILS.lengthNum(filter.data[key][1]) - LIM.UTILS.lengthNum(filter.data[key][0])) * r)
                    }
                    else if(key.split("$").length>1){
                        let str=key.split("$")
                        if(!data.data[str[0]]) data.data[str[0]]={}
                        data.data[str[0]][str[1]]=parseFloat(LIM.UTILS.lengthNum(filter.data[key][0]) + (LIM.UTILS.lengthNum(filter.data[key][1]) - LIM.UTILS.lengthNum(filter.data[key][0])) * r)
                    }
                    else data.data[key] = parseFloat(LIM.UTILS.lengthNum(filter.data[key][0]) + (LIM.UTILS.lengthNum(filter.data[key][1]) - LIM.UTILS.lengthNum(filter.data[key][0])) * r)
                }
                for (let key of Object.keys(filter.hook)) {
                    if(key.split("%").length>1){
                        let str=key.split("%")
                        if(!data.hook[str[0]]) data.hook[str[0]]=[]
                        data.data[str[0]][str[1]]=parseFloat(LIM.UTILS.lengthNum(filter.hook[key][0]) + (LIM.UTILS.lengthNum(filter.hook[key][1]) - LIM.UTILS.lengthNum(filter.hook[key][0])) * r)
                    }
                    else if(key.split("$").length>1){
                        let str=key.split("$")
                        if(!data.hook[str[0]]) data.hook[str[0]]={}
                        data.hook[str[0]][str[1]]=parseFloat(LIM.UTILS.lengthNum(filter.hook[key][0]) + (LIM.UTILS.lengthNum(filter.hook[key][1]) - LIM.UTILS.lengthNum(filter.hook[key][0])) * r)
                    }
                    else data.hook[key] = parseFloat(LIM.UTILS.lengthNum(filter.hook[key][0]) + (LIM.UTILS.lengthNum(filter.hook[key][1]) - LIM.UTILS.lengthNum(filter.hook[key][0])) * r)
                }
                this.filter(data)
            }
        }
    }
    //绘制位图
    _.Shape.prototype.draw=function() {
        if(this._com.run%5===0) this._com.run/=5
        if(this._com.option[this._com.mode])
            if(this._pic!==this._com.option[this._com.mode].pic) {
                this._buf = this._origin.getBit(this._com.option[this._com.mode].pic)
                this._buf.addLoadListener(function () {
                    this.bit();
                    this.render();
                    this.shape();
                    this.contFilter()
                }.bind(this))
            }
            else {
                this.bit();
                this.render();
                this.shape();
                this.contFilter()
            }
    }


    //bit
    _.Shape.prototype.bit=function() {
        let clip = this._com.option[this._com.mode].clip
        let sectio = this._com.option[this._com.mode].sectio
        if (clip&&sectio) {
            this.bitmap = new Bitmap(clip[6] + clip[4] * 2, clip[7] + clip[5] * 2)
            this.bitmap.blt(this._buf,
                clip[0]+(clip[2]/2*(1-sectio[0])),
                clip[1]+(clip[3]/2*(1-sectio[1])),
                clip[2]*((sectio[0]+sectio[2])/2),
                clip[3]*((sectio[1]+sectio[3])/2),
                clip[4]+(clip[6]/2*(1-sectio[0])),
                clip[5]+(clip[7]/2*(1-sectio[1])),
                clip[6]*((sectio[0]+sectio[2])/2),
                clip[7]*((sectio[1]+sectio[3])/2))
        }
        else if(clip){
            this.bitmap = new Bitmap(clip[6] + clip[4] * 2, clip[7] + clip[5] * 2)
            this.bitmap.blt(this._buf, clip[0], clip[1], clip[2], clip[3], clip[4], clip[5], clip[6], clip[7])
        }
        else this.bitmap = this._buf
    }
    //改变形态
    _.Shape.prototype.shape=function(){
        let item=this._com.option[this._com.mode]
        if(item) {
            if(this._com.run%3===0) this._com.run/=3
            switch (item.cover) {
                case 1:
                    this.scale.x = Math.max(LIM.UTILS.lengthNum(item.h) / this.height,LIM.UTILS.lengthNum(item.w) / this.width)
                    this.scale.y = this.scale.x
                    break
                case 2:
                    this.scale.x = Math.min(LIM.UTILS.lengthNum(item.h) / this.height,LIM.UTILS.lengthNum(item.w) / this.width)
                    this.scale.y = this.scale.x
                    break
                default:
                    this.scale.x = LIM.UTILS.lengthNum(item.w) / this.width
                    this.scale.y = LIM.UTILS.lengthNum(item.h) / this.height
                    break

            }
            this.anchor.x = item.sx!=null?item.sx:0.5
            this.anchor.y = item.sy!=null?item.sy:0.5
            this.x = (this.width * this.scale.x * this.anchor.x + LIM.UTILS.lengthNum(item.x))
            this.y = (this.height * this.scale.y * this.anchor.y + LIM.UTILS.lengthNum(item.y))
            this.rotation = item.rota/180*Math.PI
            this.alpha = item.alpha
        }
    }
    //着色
    _.Shape.prototype.render=function(){
        this._colorTone=this._com.option[this._com.mode].tone||[0,0,0,0]
        this._blendColor=this._com.option[this._com.mode].blend||[0,0,0,0]
        this._refresh()
    }
    //滤镜
    _.Shape.prototype.contFilter=function() {
        if (!this._com.execute.length ||
            this._com.execute[0].time < this._com.execute[0].action.change && ((this._com.execute[0].action.filter1.type === "") || (this._com.option[this._com.mode].filter.type === this._com.execute[0].action.filter1.type)) ||
            this._com.execute[0].time >= this._com.execute[0].action.change && ((this._com.execute[0].action.filter2.type === "") || (this._com.option[this._com.mode].filter.type === this._com.execute[0].action.filter2.type)))
            this.filter(this._com.option[this._com.mode].filter);
    }
    _.Shape.prototype.filter=function(data){
        if(data.type){
            //不同滤镜 替换
            if(this.filters.length===0||this.filters[0].name!==data.type) {
                let filter = LIM.UTILS.getFilter(data.type)
                filter.name = data.type
                for(let key of Object.keys(data.data))
                    filter.uniforms[key] =data.data[key]
                for(let key of Object.keys(data.hook))
                    filter[key] =data.hook[key]
                this.filters = [filter]
            }
            //相同滤镜继承
            else {
                this.filters[0].enabled=true
                for(let key of Object.keys(data.data))
                    this.filters[0].uniforms[key] = data.data[key]
                for(let key of Object.keys(data.hook))
                    this.filters[0][key] =data.hook[key]
            }
        }
        else this.filters=[]
    }
    //更新
    _.Shape.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._com.run % 2 === 0) {
            this.setAction()
            this.executeAction()
        }
        if (this._com.run % 5 === 0) this.draw()
        if (this._com.run % 3 === 0) this.shape()


    }
})(LIM.SCENE);

//缺失功能 （镜像反转图片）无法实现   （连续着色 特殊滤镜）卡顿 