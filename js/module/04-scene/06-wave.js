//===========================
// @-06-wave
// @Path      js/module/04-scene
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/24)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=> {
    _.Wave = function () {
        this.initialize.apply(this, arguments)
    }
    _.Wave.prototype = Object.create(Sprite.prototype)
    _.Wave.prototype.constructor = _.Wave;
    Object.defineProperties(_.Wave.prototype, {
        _index: {
            get: function () {
                return this._com.index||0;
            },
            configurable: true
        }
    });
    _.Wave.prototype.initialize = function (origin, name, com) {
        this._com=com
        this._name=name
        this._origin=origin
        this._time=0
        Sprite.prototype.initialize.call(this);//;
        this.shape()
    }
    _.Wave.prototype.update = function () {
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Wave.prototype.shape=function(){
        this.anchor.set(0.5, 0.5);
        this.x = Graphics.width * 0.5 + LIM.UTILS.lengthNum(this._com.x);
        this.y = Graphics.height * 0.5 + LIM.UTILS.lengthNum(this._com.y);
        this.rotation = this._com.rota / 180 * Math.PI;
        this.alpha = this._com.alpha;
        this.bitmap=new Bitmap(LIM.UTILS.lengthNum(this._com.w),LIM.UTILS.lengthNum(this._com.h))
    }
    
    _.Wave.prototype.refresh = function () {
        const wave = [];
        const step = this._time * this._com.render.step;
        const render = this._com.render;
        for (let i = 0; i < render.drop; i++) {
            let val = 0;
            for (let index in this._com.wave) {
                const data = this._com.wave[index];
                const v = this.wave(
                    data.mode, 
                    data.max,
                    parseInt((i * data.view / render.drop) + step + data.phase), 
                    data.f, data.r) / data.sample;
                switch (data.count) {
                    case "add":
                        val += v;
                        break;
                    case "mul":
                        val *= v;
                        break;
                }
            }
            wave[i] = val;
        }
        const {angle, color, width, mode} = render;
        switch (mode) {
            case 1:
                this.draw1(wave, angle, color, width);
                break;
            case 2:
                this.draw2(wave, angle, color, width);
                break;
            case 3:
                this.draw3(wave, angle, color, width);
                break;
            case 4:
                this.draw4(wave, angle, color, width);
                break;
            case 5:
                this.draw5(wave, angle, color, width);
                break;
            case 6:
                this.draw6(wave, angle, color, width);
                break;
            case 7:
                this.draw7(wave, angle, color, width);
                break;
            case 8:
                this.draw8(wave, angle, color, width);
                break;
            default:
                this.drawWave(wave, angle, color, width);
                break;
        }
        this._time++;
    };
    _.Wave.prototype.wave=function(mode,max,i,f,r) {
        if(mode%5==0) i*=2
        let p=parseInt(i/(max/(1/f)))%2===1?-1:1
        let o=parseInt(i/(max/(1/f)))%4%2===1?-1:1
        let q=i%(max/f)
        let value=0;
        switch (mode) {
            //弦
            case 104://方波 
                value=(Math.sin((Math.PI * 2 / max * q)) >= 0 ? 1 : -1)*
                    (Math.sin((Math.PI * 2 / (max/2) * q)) >= 0 ? 0 : 1)
                break;
            case 204://三角波
                value = (2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q));
                break;
            case 304://正弦波
                value = Math.sin((Math.PI * 2 / max* q));break
            case 404://平滑波
                value=Math.floor((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q))*10+0.5)/10;
                break;
                
            case 105: //半圆波  
                value=  Math.sqrt(1 - Math.pow(((q%max)*2/max-1),4))*p;break
            case 205: //方根波
                value = Math.sqrt(Math.abs(Math.sin((Math.PI/max*q))))*p;break;
            case 305: //方根波 
                let s = Math.E;
                value=(1-((q/max-1)*(q/max) * ((s+1)*(q/max)+s)+1))*p;break
            case 405: //弹跳波
                value= Math.exp(-Math.pow(q*2 - max,2) / (2 * Math.pow(max / 6, 2)))
                value=p>0?value:1-value
                value=o>0?value:(1-value)*-1;
                break
            case 505: //平方三角
                value =  Math.pow((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q)),2)*p;break
            case 605: //平方正弦
                value = Math.pow(Math.sin((Math.PI * 2 / max* q)),2)*p;break
            case 705: //斐波那契 //
                let angle = 0.5 * Math.sqrt(p>0?q:max-q);
                let radius = Math.sqrt(q/ max);
                let x1 = radius * Math.cos(angle);
                let y1 = radius * Math.sin(angle);
                value=(Math.abs(x1)+Math.abs(y1))*p
                break


            //随机
            case 101: //振荡
                value= Math.sin(q);break
            case 201: //振荡余弦
                value= Math.cos(q)*Math.sin(q);break
            case 301: //振荡正切
                value= Math.tan(q);break
            case 401: //平均振荡
                value= (Math.sin(q) + Math.cos(q)) / 2;break


            //过渡
            case 102: //指数
                value = 1-Math.pow(1.03,-q)
                break
            case 202: //反比例
                value = 1 /(q+100)*q
                break
            case 302:  //弦反比例
                value = (0.14/(Math.abs(Math.sin((Math.PI * 2 / max* (max-q)/4)))+0.14))
                break
            case 402:  //方根
                value= Math.sqrt(q/max);break
            case 502:  //平方
                value= Math.pow(q/max,2);break
            case 602:  //正态
                value= Math.exp(-Math.pow(q*1 - max,2) / (2 * Math.pow(max / 6, 2)));break
            case 702:  //弹性
                value=  Math.pow(2, -10 * q / max) * Math.sin((q / max - 0.1) * (2 * Math.PI) / 0.4) + 1;break
            case 802:  //贝塞尔
                value= 3 * (q/max) * Math.pow(1 -  (q/max) , 2) + 3 * Math.pow( (q/max) , 2) * (1 -  (q/max) ) + Math.pow( (q/max) , 3);break
            case 902:  //阻尼振荡
                let f = 0.3;
                let s1 = f / 4;
                value=  Math.pow( 2, -10 *  (q/max)) * Math.sin(( (q/max) - s1) * (2 * Math.PI)) + 1;
        }
        return value*(r?-1:1);
    }
    _.Wave.prototype.drawWave=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/wave.length
        let sy=this.height/2
        for(let i=1;i<wave.length;i++) {
            context.beginPath();
            context.moveTo(sx*(i-1), this.height-(sy+sy*wave[i-1]));
            context.lineTo( sx*i, this.height-(sy+sy*wave[i]));
            context.stroke();
        }
    }
    _.Wave.prototype.draw1=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let sx1=this.width/wave.length
        let sy1=this.height/wave.length
        
        for(let i=1;i<wave.length;i++) {
            context.beginPath();
            context.moveTo(sx+sx*wave[i-1],sy1*[i-1]);
            context.lineTo(sx1*i,this.height-(sy+sy*wave[i]));
            context.stroke();
        }
    }
    _.Wave.prototype.draw2=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.width/wave.length
        let p=parseInt(wave.length/3)
        for(let i=0;i<p;i++) {
            context.beginPath();
            
            context.moveTo(sx+sx*wave[i],sy*(i));
            context.lineTo(sx+sx*wave[i+p*2],sy*(i+p*2));

            context.moveTo(sx+sx*wave[i],sy*(i));
            context.lineTo(sx+sx*wave[i+p],sy*(i+p));

            context.moveTo(sx+sx*wave[i+p],sy*(i+p));
            context.lineTo(sx+sx*wave[i+p*2],sy*(i+p*2));
            
            context.stroke();
        }
    }
    
    _.Wave.prototype.draw3=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let radius = Math.max(sx,sy)/2;
        let r=angle/wave.length
        for(let i=1;i<wave.length;i++) {
            context.beginPath();
            let r1= ((i-1)*r)*(Math.PI/180)
            let r2= (i*r)*(Math.PI/180)
            context.moveTo(
                sx + (radius* wave[i-1]) * Math.cos(r1),
                sy + (radius* wave[i-1]) * Math.sin(r1)
            );
            context.lineTo(
                sx + (radius* wave[i]) * Math.cos(r2),
                sy + (radius* wave[i]) * Math.sin(r2));
            context.stroke();
        }
    }
    _.Wave.prototype.draw4=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let radius = Math.max(sx,sy)/2;
        let r=angle/wave.length
        let p=parseInt(wave.length/2)
        for(let i=0;i<p;i++) {
            context.beginPath();
            let r1= ((i+p)*r)*(Math.PI/180)
            let r2= (i*r)*(Math.PI/180)
            context.moveTo(
                sx +(radius-(radius* wave[i+p])) * Math.cos(r1),
                sy +(radius-(radius* wave[i+p])) * Math.sin(r1)
            );
            context.lineTo(
                sx +(radius-(radius* wave[i])) * Math.cos(r2),
                sy +(radius-(radius* wave[i])) * Math.sin(r2));
            context.stroke();
        }
    }
    _.Wave.prototype.draw5=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let radius = Math.max(sx,sy)/2;
        for(let i=1;i<wave.length;i++) {
            context.beginPath();
            let r1= (i-1)
            let r2= (i)
            context.moveTo(
                sx+((radius*wave[i-1])) * Math.cos(r1),
                sy+((radius*wave[i-1])) * Math.sin(r1)
            );
            context.lineTo(
                sx+((radius* wave[i])) * Math.cos(r2),
                sy+((radius* wave[i])) * Math.sin(r2));
            context.stroke();
        }
    }
    
    _.Wave.prototype.draw6=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let radius = Math.max(sx,sy)/2;
        let r=angle/wave.length
        for(let i=1;i<wave.length;i++) {
            context.beginPath();
            let r1= ((i-1)*r)
            let r2= (i*r)
            context.moveTo(
                sx+(radius-radius*wave[i-1])*Math.cos(r1),
                sy+(radius-radius*wave[i-1])*Math.sin(r1)
            );
            context.lineTo(
                sx+(radius-radius*wave[i])*Math.cos(r2),
                sy+(radius-radius*wave[i])*Math.sin(r2));
            context.stroke();
        }
    }
    _.Wave.prototype.draw7=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let radius = Math.max(sx,sy)/2;
        let r=angle/wave.length
        for(let i=1;i<wave.length;i++) {
            context.beginPath();
            let r1= ((i-1)*r)*Math.E
            let r2= (i*r)*Math.E
            context.moveTo(
                sx+(radius-radius*wave[i-1])*Math.cos(r1),
                sy+(radius-radius*wave[i-1])*Math.sin(r1)
            );
            context.lineTo(
                sx+(radius*wave[i])*Math.cos(r2),
                sy+(radius*wave[i])*Math.sin(r2));
            context.stroke();
        }
    }
    _.Wave.prototype.draw8=function (wave,angle,color,width){
        this.bitmap.clear()
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx=this.width/2
        let sy=this.height/2
        let radius = Math.max(sx,sy)/2;
        
        for(let i=1;i<wave.length;i++) {
            let angle1=(i-1)*(angle*Math.E)
            let angle2=i*(angle*Math.E)
            context.beginPath();
            context.moveTo(
                sx + (radius * wave[i-1]) * Math.cos(angle1),
                sy + (radius * wave[i-1]) * Math.sin(angle1)
            );
            context.lineTo(
                sx + (radius * wave[i]) * Math.cos(angle2),
                sy + (radius * wave[i]) * Math.sin(angle2));
            context.stroke();
        }
    }

    _.Wave.prototype.isActi=function(){return this._com.acti}
    _.Wave.prototype.isRun=function(){return true}
})(LIM.SCENE)