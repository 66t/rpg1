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
        Sprite.prototype.initialize.call(this);//;
    }

    
    _.Shape.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if(this.isActi()) {
            this.refresh()
        }
    }
    _.Shape.prototype.refresh = function () {
        if(this._action.length) this.executeAction()
        else if(this._com.next!==this._com.mode) this.shiftMode()
        
        if(this.isRun(0)) this.draw()
        if(this.isRun(1)) this.render()
        if(this.isRun(2)) this.shape()
    }
    _.Shape.prototype.executeAction=function() {
        let item = this._action[0]

        //执行动画
        if(item.time<item.change) this.executeAnime(item.anime1,[item.change,item.time])
        else this.executeAnime(item.anime2,[item.frame-item.change,item.time-item.change])
        
        //执行方法
        if (item.time == 0) {
            this._origin.triggerFun(this._action[0].funS)
        }
        if(item.time==item.change){
            this._origin.triggerFun(this._action[0].funC)
        }
        if(item.time==item.frame){
            this._origin.triggerFun(this._action[0].funE)
            this.setRun(0,true)
            this._action.splice(0,1)
        }
        item.time++
    }
    _.Shape.prototype.executeAnime=function(anime,time) {
        for(let item of Object.keys(anime)){
            let r = LIM.UTILS.waveNum(anime[item].wave, time[0],time[1])
            console.log(r)
        }
    }
    
    _.Shape.prototype.shiftMode=function(){
        let index1=this._index
        this._data=this._com.data[this._com.next]
        let index2=this._index
        if(index1!=index2&&!this._origin.isRun(1)) this._origin.setRun(1,true)
        let mode=this._com.mode
        this._com.mode=this._com.next
        this.pushAction(mode,this._com.next)
    }
    _.Shape.prototype.pushAction=function(mode,next){
        let fun=mode+"_"+next
        if(this._com.action[fun]){
            this._com.action[fun].time=0
            this._action.push(this._com.action[fun])
        }
        else if(!this.isRun(0)) this.setRun(0,true)
    }
    
    
    _.Shape.prototype.draw=function() {
        if(this.isRun(0)) this.setRun(0,false)
        let bit = this._origin.getBit(this._data.bit)
        let that=this
        bit.addLoadListener(function () {
            if(that._data.clip) that.clip(bit,that._data.clip)
            else that.bitmap=bit
            if(!this.isRun(1)) this.setRun(1,true)
            if(!this.isRun(2)) this.setRun(2,true)
           }.bind(this)
        )
    }
    _.Shape.prototype.clip=function(bit,clip) {
        this.bitmap=new Bitmap(clip[6]+clip[4]*2,clip[7]+clip[5]*2)
        this.bitmap.blt(bit,clip[0],clip[1],clip[2],clip[3],clip[4],clip[5],clip[6],clip[7])
    }
  
    _.Shape.prototype.render=function(){
        if(this.isRun(1)) this.setRun(1,false)
        this._colorTone=this._data.tone||[0,0,0]
        this._blendColor=this._data.blend||[0,0,0]
        this._refresh()
    }
    _.Shape.prototype.shape=function(){
        if(this.isRun(2)) this.setRun(2,false)
        let item=this._data
       
        if(item) {
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
            this.anchor.x = 0.5
            this.anchor.y = 0.5
            this.x = (this.width * this.anchor.x + LIM.UTILS.lengthNum(item.x)) * this.scale.x
            this.y = (this.height * this.anchor.y + LIM.UTILS.lengthNum(item.y)) * this.scale.y
            this.rotation = item.rota/180*Math.PI
            this.alpha = item.alpha
        }
    }
    _.Shape.prototype.isActi=function(){return this._com.acti}
    _.Shape.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Shape.prototype.setRun=function(bit,bool){
        this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);
    }
    
    
})(LIM.SCENE);