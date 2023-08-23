﻿var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=>{
    _.Shape=function(){this.initialize.apply(this,arguments)}
    _.Shape.prototype = Object.create(Sprite.prototype)
    _.Shape.prototype.constructor = _.Shape;
    Object.defineProperties(_.Shape.prototype, {
        _index: {get: function () {return this._data?this._data.index:0}, configurable: true}
    });
    _.Shape.prototype.initialize = function (origin,name,com) {
        this._action=[]
        this._com=com
        this._name=name

        this._time=0
        this._filkey=""
        this._com.next=0
        this._com.mode=-1
        this._origin=origin
        Sprite.prototype.initialize.call(this);//;
        this._filter=new LIM.SCENE.Filter()
    }

    _.Shape.prototype.update = function () {
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Shape.prototype.refresh = function () {
        this._time++
        if(this._action.length) this.executeAction()
        else if(this._com.next!==this._com.mode) this.shiftMode()
        else if(this._com.loop) this.loopMode()
        
        if(!this.refreshFilter()) {
            if(this.isRun(0)) this.draw()
            if(this.isRun(1)) this.render(this._data)
            if(this.isRun(2)) this.shape(this._data)
            if(this.isRun(4)&&this._data) this.createFilter(this._data.filter)
        }
    }
    _.Shape.prototype.executeAction=function() {
        let item = this._action[0]
        //执行动画
        if(item.time<item.change) {
            if(item.anime1)  this.executeAnime(item.anime1, [item.change, item.time])
            if(item.effect1) this.executeEffect()
        }
        else {
            if(item.anime2) this.executeAnime(item.anime2, [item.frame - item.change, item.time - item.change])
            if(item.effect2) this.executeEffect(item.effect2, [item.frame - item.change, item.time - item.change]) 
        }
        //执行方法
        if (item.time === 0) {
            if(this._action[0].com1)  this._origin.triggerHandler(this._action[0].comS)
            if(this._action[0].filter1)  this.createFilter(this._action[0].filter1)
        }
        if(item.time===item.change){
            if(this._action[0].com1) this._origin.triggerHandler(this._action[0].com1)
            if(this._action[0].filter2) this.createFilter(this._action[0].filter2)
            else this.setRun(4,true)
            
            let a1 =this._index
            this._data=this._com.data[this._com.next]
            let a2 =this._index
            this._time=0
            
            if(a1!==a2)this._origin.showItem()
            this.setRun(0,true)
        }
        if(item.time>=item.frame){
            if(!this._action[0].filter2) this.setRun(4,true)
            if(this._action[0].com2) this._origin.triggerHandler(this._action[0].com2)
            this._action.splice(0,1)
        }
        item.time++
    }
    
    _.Shape.prototype.refreshFilter =function (){
            let data = this.updateFilter()
            if (data[1] !== this._filkey) {
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
                        this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                            this._filter.filter[s[2]].app, this._filter.filter[s[3]].app, this._filter.filter[s[4]].app];
                        break
                    case 6:
                        this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app, this._filter.filter[s[2]].app,
                            this._filter.filter[s[3]].app, this._filter.filter[s[4]].app, this._filter.filter[s[5]].app];
                        break
                    case 7:
                        this.filters = [this._filter.filter[s[0]].app, this._filter.filter[s[1]].app,
                            this._filter.filter[s[2]].app, this._filter.filter[s[3]].app,
                            this._filter.filter[s[4]].app, this._filter.filter[s[5]].app, this._filter.filter[s[5]].app];
                        break
                }
            }
            if (data[2]) console.log(data[2])
            return data[0]
    }
    _.Shape.prototype.updateFilter = function () {
        return this._filter.updateFilter()
    }
    _.Shape.prototype.createFilter = function (data) {
        if (this.isRun(4)) {this.setRun(4, false)}
        this._filter=new LIM.SCENE.Filter()
        for (let key in data) this._filter.createFilter(key,data[key])
        this.filters = [];
    }

    _.Shape.prototype.executeEffect = function (effect,time) {
        if(!this.backups) return
        let w = this.backups.width;
        let h = this.backups.height;
        let r = LIM.UTILS.sinNum(1,time[1] / time[0]);
        this.bitmap.clear();
        let data=[]
        if(time[1]===time[0])
            this.bitmap.blt(this.backups, 0, 0, w,h,0,0);
        else
            switch (effect.mode){
                case "shades":
                    data[0]=effect.block||4
                    data[1]=effect.x||4
                    data[2]=effect.y||4
                    data[3]=w/data[1]
                    data[4]=h/data[2]
                    for (let x = 0; x < data[1]; x++) {
                        for (let y = 0; y < data[2]; y++) {
                            if(r>=Math.random()*Math.random()){
                                let startX = data[3] * x
                                let startY = data[4] * y
                                this.bitmap.blt(this.backups, startX, startY,  data[3],  data[4], startX, startY);
                            }
                        }
                    }
                    break
                case "crt":
                    const shuffleArray = n => Array.from({length: n + 1}, (_, i) => i).sort(() => Math.random() - 0.5);
                    const shuffledArray = shuffleArray(effect.v?h:w);
                    if(effect.v)
                        for (let y = 0; y < h; y++) {
                            if(r<0.3)  this.bitmap.blt(this.backups, 0, y,  w,  effect.s, 0, shuffledArray[y]);
                            else  this.bitmap.blt(this.backups, 0, y,  w,  effect.s, 0, h*((r-0.3)/0.7)<=y?shuffledArray[y]:y);
                        }
                    else
                        for (let x = 0; x < w; x++) {
                            let q1=Math.random()
                            let q2=Math.random()
                            let q3=Math.random()
                            if(r<0.3)  this.bitmap.blt(this.backups, x, 0.5*h*q1*(1-r),  effect.s,h-(h*q2)*(1-r),  shuffledArray[x],h*q3*(1-r), effect.s,h);
                            else  this.bitmap.blt(this.backups, x, 0.5*h*q1*(1-r),  effect.s,h-(h*q2)*(1-r), w*((r-0.3)/0.7)<=x?shuffledArray[x]:x, h*q3*(1-r), effect.s,h);
                        }
                    break
                case "line":
                    for (let i = 0; i < effect.box; i++) {
                        for (let j = 0; j < 15; j++) {
                            this.bitmap.blt(this.backups, i * w /  effect.box, j * h /  effect.box,
                                w /  effect.box * r, h /  effect.box * r,
                                (i) * w /  effect.box + w /  effect.box * (1 - r) + (w/2-w * (Math.random())) * (1 - r),
                                (j) * h /  effect.box + w /  effect.box * (1 - r) + (h/2-h * (Math.random()))*(1 - r),
                                w / (effect.box + effect.size * (1 - r + (Math.random() * (1 - r)))),
                                h / (effect.box + effect.size * (1 - r + (Math.random() * (1 - r)))));
                        }
                    }
                    break
                case "eliminate":
                    if(r<0.5) {
                        let f = w/16 * (1 - r)+1
                        for (let x = 0; x < w / f; x++) {
                            this.bitmap.blt(this.backups, x * f, 0, f, h, w - x * f, 0);
                            this.bitmap.blt(this.backups, w-x * f, 0, f, h,  x * f, 0);
                        }
                    }
                    else {
                        let f = w/8 * (1 - r)+1
                        let t=((r-0.5)*2)*(w/f)
                        for (let x = 0; x < w / f; x++)
                            if(x<t)
                                this.bitmap.blt(this.backups, w-x*f, 0, f, h, w-x*f,  0);
                            else {
                                this.bitmap.blt(this.backups, x*f, 0, f, h, w-x*f,  0);
                                this.bitmap.blt(this.backups, w-x*f, 0, f, h, x*f,  0);
                            }
                    }
                    break
            }
    };
    _.Shape.prototype.executeAnime = function (anime, time) {
        if(!this._data) return
        let data = {
            x: this._data.x,
            y: this._data.y,
            alpha: this._data.alpha,
            angle: this._data.angle,
            space: this._data.space,
            rota: this._data.rota,
            w: this._data.w,
            h: this._data.h,
            cover: this._data.cover,
            adso: this._data.adso,
        }
        let shape=LIM.UTILS.countWave(anime,time,data)
        for(let key in shape){
            data[key]=shape[key]
            this._data[key]=data[key]
        }
        this.shape(data);
    };
    
    _.Shape.prototype.shiftMode=function(){
        this.backups=null
        let index1=this._index
        let index2=this._com.data[this._com.next]
        if(index1!==index2&&!this._origin.isRun(1)) this._origin.setRun(1,true)
        let mode=this._com.mode
        this._com.mode=this._com.next
        this.pushAction(mode,this._com.next)
        if(this._action.length) this.executeAction()
    }
    _.Shape.prototype.loopMode=function(){
        let mode=this._com.mode
        if(this._com.action[mode]){
            this._com.action[mode].time=0
            this._action.push(this._com.action[mode])
            this.executeAction()
        }
    }
    _.Shape.prototype.pushAction=function(mode,next){
        let fun=mode+"_"+next
        if(this._com.action&&this._com.action[fun]){
            this._com.action[fun].time=0
            this._action.push(this._com.action[fun])
        }
        else if(!this.isRun(0)) {
            this._data=this._com.data[this._com.next]
            this._time=0
            this.setRun(0,true)
            this.setRun(4,true)
        }
    }
    
    _.Shape.prototype.draw=function() {
        if(this.isRun(0)) this.setRun(0,false)
        let bit = this._origin.getBit(this._data.bit)
        if(!bit) return
        let that=this
        bit.addLoadListener(function () {
                bit=that.matrixTransform(bit,that._com.matrix)
                that.setBitmap("bitmap",bit)
                that.setBitmap("backups",bit)
                if(!this.isRun(1)) this.setRun(1,true)
                if(!this.isRun(2)) this.setRun(2,true)
                if(!this.isRun(3)) this.setRun(3,true)
            }.bind(this)
        )
    }
    _.Shape.prototype.matrixTransform=function(bit,mode) {
        if(mode) {
            let newbit = new Bitmap(bit.width, bit.height)
            let w=bit.width
            let h=bit.height
            switch (mode){
                case 1:
                    for(let i=0;i<w;i++)
                        newbit.blt(bit,w-i,0,1,h,i,0)
                    break
                case 2:
                    for(let i=0;i<h;i++)
                        newbit.blt(bit,0,h-i,w,1,0,i)
                    break

            }
            return newbit
        }
        else return bit
    }
    
    _.Shape.prototype.setBitmap=function(target,bit){
        if(this._data.clip) this.clip(target,bit,this._data.clip)
        else this[target]=bit
    }
    _.Shape.prototype.clip=function(target,bit,clip) {
        this[target]=new Bitmap(clip[6]+clip[4]*2,clip[7]+clip[5]*2)
        this[target].blt(bit,clip[0],clip[1],clip[2],clip[3],LIM.UTILS.lengthNum(clip[4]),LIM.UTILS.lengthNum(clip[5]),LIM.UTILS.lengthNum(clip[6]),LIM.UTILS.lengthNum(clip[7]))
    }
    _.Shape.prototype.render=function(item){
        if(this.isRun(1)) this.setRun(1,false)
        this._colorTone=item.tone||[0,0,0]
        this._blendColor=item.blend||[0,0,0]
        this._refresh()
    }

    _.Shape.prototype.shape=function(item){
        if(this.isRun(2)) this.setRun(2,false)
        this.cover(item);
        this.anchor.set(0.5, 0.5);
        
        let sx=item.adso % 3 === 1 ? this.width * this.scale.x * 0.5 :
            item.adso % 3 === 2 ? Graphics.width * 0.5 :
                Graphics.width - this.width * this.scale.x * 0.5;
        let sy=item.adso > 6 ? this.height * this.scale.y * 0.5 :
            item.adso < 4 ? Graphics.height - this.height * this.scale.y * 0.5 :
                Graphics.height * 0.5;

        if(item.space){
            let arr=  LIM.UTILS.azimuth(
                {x:sx + LIM.UTILS.lengthNum(item.x), y:sy + LIM.UTILS.lengthNum(item.y)},
                (item.angle||0)*Math.PI/180,
                LIM.UTILS.lengthNum(item.space))
            this.x=arr.x;
            this.y=arr.y
        }
        else {
            this.x = sx + LIM.UTILS.lengthNum(item.x);
            this.y = sy + LIM.UTILS.lengthNum(item.y);
        }
        this.rotation = item.rota / 180 * Math.PI;
        this.alpha = item.alpha;
        
        if(!this.scale.x) {debugger}
    }
    _.Shape.prototype.cover=function(item){
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
    }
    
    
    _.Shape.prototype.isActi=function(){return this._com.acti}
    _.Shape.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Shape.prototype.setRun=function(bit,bool){
        this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);
    }
})(LIM.SCENE);