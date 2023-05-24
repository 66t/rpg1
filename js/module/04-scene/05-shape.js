﻿var LIM=LIM||{};
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
        if(this.isRun(3)) this.filter()
    }
    _.Shape.prototype.executeAction=function() {
        let item = this._action[0]

        //执行动画 执行滤镜
        if(item.time<item.change) {
            this.executeAnime(item.anime1, [item.change, item.time])
            this.executeFilter(item.filter1,[item.change, item.time])
        }
        else {
            this.executeAnime(item.anime2, [item.frame - item.change, item.time - item.change])
            this.executeFilter(item.filter2,[item.frame - item.change, item.time - item.change])
        }
        
        
        //执行方法
        if (item.time == 0) {
            this._origin.triggerFun(this._action[0].funS)
        }
        if(item.time==item.change){
            this._origin.triggerFun(this._action[0].funC)
            this.setRun(0,true)
        }
        if(item.time==item.frame){
            this._origin.triggerFun(this._action[0].funE)
            this._action.splice(0,1)
        }
        item.time++
    }
    _.Shape.prototype.executeAnime=function(anime,time) {
        for(let item of Object.keys(anime)){
            let r = LIM.UTILS.waveNum(anime[item].wave, time[0],time[1])
            let val=anime[item].val1+(anime[item].val2-anime[item].val1)*r
           switch (item) {
               case "x":
                   this.anchor.x=0.5+val;break
               case "y":
                   this.anchor.y=0.5+val;break
               case "alpha":
                   this.alpha=val;break
                   
           }
        }
    }
    _.Shape.prototype.executeFilter=function(filter,time) {
        console.log(filter)
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
            if(!this.isRun(3)) this.setRun(3,true)
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
    _.Shape.prototype.filter=function(){
        if(this.isRun(3)) this.setRun(3,false)
        let item=this._data
        this.filters=[]
        this.filterType=[]
        if(item.filter.length)
        for(let i=0;i<item.filter.length;i++) {
            let filter = this.typeFilter(item.filter[i].type)
            this.filterType[i]=item.filter[i].type
            for (let key of Object.keys(item.filter[i].data)) 
                if(key[0]=="#") filter.uniforms[key.slice(1)] = item.filter[i].data[key.slice(1)]
                else  filter[key] = item.data[key]
            switch (i) {
                case 0:this.filters=[filter];break
                case 1:this.filters=[this.filters[0],filter];break
                case 2:this.filters=[this.filters[0],this.filters[1],filter];break
                case 3:this.filters=[this.filters[0],this.filters[1],this.filters[2],filter];break
            }
        }
    }
    _.Shape.prototype.setFilter=function(data){

    }
    _.Shape.prototype.isActi=function(){return this._com.acti}
    _.Shape.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._com.run,bit)}
    _.Shape.prototype.setRun=function(bit,bool){
        this._com.run = LIM.UTILS.setBit(this._com.run,bit,bool);
    }
    
    _.Shape.prototype.typeFilter=function(type){
        switch (type) {
            case "adj": return new PIXI.filters.AdjustmentFilter()
            case "bloom": return new PIXI.filters.AdvancedBloomFilter()
            case "ascii": return new PIXI.filters.AsciiFilter()
            case "bulge": return new PIXI.filters.BulgePinchFilter()
            case "colorRep": return new PIXI.filters.ColorReplaceFilter()
            case "cross": return new PIXI.filters.CrossHatchFilter()
            case "crt": return new PIXI.filters.CRTFilter()
            case "dot": return new PIXI.filters.DotFilter()
            case "emboss": return new PIXI.filters.EmbossFilter()
            case "glitch": return new PIXI.filters.GlitchFilter()
            case "glow": return new PIXI.filters.GlowFilter()
            case "motion": return new PIXI.filters.MotionBlurFilter([100,100],3,10)
            case "outline": return new PIXI.filters.OutlineFilter()
            case "old": return new PIXI.filters.OldFilmFilter()
            case "pixel": return new PIXI.filters.PixelateFilter()
            case "radial": return new PIXI.filters.RadialBlurFilter(100,{x:0,y:0})
            case "rgb": return new PIXI.filters.RGBSplitFilter([0,0],[0,0],[0,0])
            case "tiltX": return new PIXI.filters.TiltShiftXFilter()
            case "tiltY": return new PIXI.filters.TiltShiftYFilter()
            case "twist": return new PIXI.filters.TwistFilter()
            case "zoom": return new PIXI.filters.ZoomBlurFilter()
        }
    }
    _.Shape.prototype.changeFilter=function(data){}
  
    
})(LIM.SCENE);