var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Shape=function(){this.initialize.apply(this,arguments)}
    _.Shape.prototype = Object.create(Sprite.prototype)
    _.Shape.prototype.constructor = _.Shape;
    Object.defineProperties(_.Shape.prototype, {
        _index: {
            get: function ()
            {return this._com.data.length>this._com.next?this._com.data[this._com.next].index:0;},
            configurable: true}
    });
    _.Shape.prototype.initialize = function (origin,name,com) {
        this._action=[]
        this._com=com
        this._com.mode=-1
        this._com.next=0
        this._name=name
        this._origin=origin
        this._time=0
        this.filterType=[]
        Sprite.prototype.initialize.call(this);//;
    }
    
    _.Shape.prototype.update = function () {
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Shape.prototype.refresh = function () {
        if(this._action.length) this.executeAction()
        else if(this._com.next!==this._com.mode) this.shiftMode()
        else if(this._com.loop) this.loopMode()
        
        if(this.isRun(0)) this.draw()
        if(this.isRun(1)) this.render(this._data)
        if(this.isRun(2)) this.shape(this._data)
        if(this.isRun(3)) this.filter(this._data)
        this._time++
    }
    _.Shape.prototype.executeAction=function() {
        let item = this._action[0]
        
        //执行动画 执行滤镜
        if(item.time<item.change) {
            if(item.anime1)this.executeAnime(item.anime1, [item.change, item.time])
            if(item.filter1&&item.filter1.length) this.executeFilter(item.filter1,[item.change, item.time])
        }
        else {
            if(item.anime2)this.executeAnime(item.anime2, [item.frame - item.change, item.time - item.change])
            if(item.filter2&&item.filter2.length) this.executeFilter(item.filter2,[item.frame - item.change, item.time - item.change])
        }
        //执行方法
        if (item.time == 0) { 
            if(this._action[0].comS)  this._origin.triggerHandler(this._action[0].comS)
        }
        if(item.time==item.change){
            if(this._action[0].comC) this._origin.triggerHandler(this._action[0].comC)
            this._data=this._com.data[this._com.next]
            this._time=0
            if(!item.while) this.setRun(0,true)
        }
        if(item.time>=item.frame){
            if(this._action[0].comE) this._origin.triggerHandler(this._action[0].comE)
            this._action.splice(0,1)
        }
        item.time++
    }
    _.Shape.prototype.executeAnime = function (anime, time) {
        if(!this._data)return
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
    _.Shape.prototype.executeFilter=function(data,time) {
       if(data.length)
        for (let i=0;i<data.length;i++) {
           let filter
           if (this.filterType[data[i].id] === data[i].type) 
               filter = this.filters[data[i].id]
           else {
               this.filterType[data[i].id] = data[i].type
               filter = LIM.Filter(data[i].type)
               this.setFilter(i, filter)
           }
           for(let key in data[i].data){
               let r = LIM.UTILS.waveNum(data[i].data[key].wave, time[0]/(1+data[i].data[key].fre*2),time[1])
               let val=LIM.UTILS.lengthNum(data[i].data[key].val1)+
                   (LIM.UTILS.lengthNum(data[i].data[key].val2)-LIM.UTILS.lengthNum(data[i].data[key].val1))*r
               if(key[0]=="#") filter.uniforms[key.slice(1)] = val
               else  filter[key] = val
           }
       }
       else if(this.filterType.length){
           this.filterType=[]
           this.filters=[]
       }
    }
    
    
    _.Shape.prototype.shiftMode=function(){
        let index1=this._index
        let index2=this._com.data[this._com.next]
        if(index1!=index2&&!this._origin.isRun(1)) this._origin.setRun(1,true)
        let mode=this._com.mode
        this._com.mode=this._com.next
        this.pushAction(mode,this._com.next)
        if(this._action.length)this.executeAction()
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
        }
    }
    
    
    _.Shape.prototype.draw=function() {
        if(this.isRun(0)) this.setRun(0,false)
        let bit = this._origin.getBit(this._data.bit)
        let that=this
        bit.addLoadListener(function () {
            that.setBitmap(bit)
            if(!this.isRun(1)) this.setRun(1,true)
            if(!this.isRun(2)) this.setRun(2,true)
            if(!this.isRun(3)) this.setRun(3,true)
           }.bind(this)
        )
    }
    _.Shape.prototype.setBitmap=function(bit){
        if(this._data.clip) this.clip(bit,this._data.clip)
        else this.bitmap=bit
    }
    _.Shape.prototype.clip=function(bit,clip) {
        this.bitmap=new Bitmap(clip[6]+clip[4]*2,clip[7]+clip[5]*2)
        this.bitmap.blt(bit,clip[0],clip[1],clip[2],clip[3],LIM.UTILS.lengthNum(clip[4]),LIM.UTILS.lengthNum(clip[5]),LIM.UTILS.lengthNum(clip[6]),LIM.UTILS.lengthNum(clip[7]))
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
    _.Shape.prototype.filter=function(item){
        if(this.isRun(3)) this.setRun(3,false)
        this.filters=[]
        this.filterType=[]
        if(item.filter&&item.filter.length)
        for(let i=0;i<item.filter.length;i++) {
            let filter = LIM.Filter(item.filter[i].type)
            this.filterType[i]=item.filter[i].type
            this.setFilter(i,filter)
            for (let key in item.filter[i].data)
                if(key[0]=="#") filter.uniforms[key.slice(1)] = item.filter[i].data[key.slice(1)]
                else  filter[key] = item.filter[i].data[key]
        }
    }
    
    _.Shape.prototype.setFilter=function(i,filter){
        switch (i) {
            case 0:this.filters=[filter];break
            case 1:this.filters=[this.filters[0],filter];break
            case 2:this.filters=[this.filters[0],this.filters[1],filter];break
            case 3:this.filters=[this.filters[0],this.filters[1],this.filters[2],filter];break
        }
    }
    
    _.Shape.prototype.isActi=function(){return this._com.acti}
    _.Shape.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Shape.prototype.setRun=function(bit,bool){
        this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);
    }
})(LIM.SCENE);