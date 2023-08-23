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
            for (let index in this._com.data) {
                const data = this._com.data[index];
                let num =  LIM.UTILS.waveNum(data.wave,
                    data.max,
                    parseInt((i * data.view / render.drop) + step + data.phase),
                    data.freq, data.reve) / data.sample;
                if(data.digit) num=Math.round(num)
                switch (data.count) {
                    case "add":
                        val += num;
                        break;
                    case "mul":
                        val *= num;
                        break;
                    case "and":
                        val = val&num;
                        break;
                    case "or":
                        val = val|num;
                        break;
                    case "xor":
                        val = val^num;
                        break;
                    case "max":
                        val = Math.max(val,num);
                        break;
                    case "min":
                        val = Math.min(val,num);
                        break;
                    case "pow":
                        val=Math.pow(val,num)
                        break
                }
            }
            wave[i] = val;
        }
        const {angle, color, width, mode} = render;
        switch (mode) {
            case 1:
            case '1':
                this.draw1(wave, angle, color, width);
                break;
            case 2:
            case '2':
                this.draw2(wave, angle, color, width);
                break;
            case 3:
            case '3':
                this.draw3(wave, angle, color, width);
                break;
            case 4:
            case '4':
                this.draw4(wave,angle, color, width);
                break;
            case 5:
            case '5':
                this.draw5(wave, angle, color, width);
                break;
            case 6:
            case '6':
                this.draw6(wave, angle, color, width);
                break;
            case 7:
            case '7':
                this.draw7(wave, angle, color, width);
                break;
            case 8:
            case '8':
                this.draw8(wave, angle, color, width);
                break;
            case 9:
            case '9':
                this.draw9(wave, angle, color, width);
                break;
            default:
                this.drawWave(wave, angle, color, width);
                break;
        }
        this._time++;
    };
    
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
    _.Wave.prototype.draw9=function (wave,angle,color,width){
        this.bitmap.clear();
        let context = this.bitmap.context;
        context.strokeStyle = color;
        context.lineWidth = width;
        let sx = this.width / 2;
        let sy = this.height / 2;
        let radius = Math.max(sx, sy) / 2;
        let r = angle / wave.length;

        for (let i = 1; i < wave.length; i++) {
            context.beginPath();
            let r1 = ((i - 1) * r) * Math.PI / 180;
            let r2 = (i * r) * Math.PI / 180;
            let startX = sx + (radius * wave[i - 1]) * Math.cos(r1);
            let startY = sy + (radius * wave[i - 1]) * Math.sin(r1);
            let endX = sx + (radius * wave[i]) * Math.cos(r2);
            let endY = sy + (radius * wave[i]) * Math.sin(r2);
            context.moveTo(startX, startY);
            context.quadraticCurveTo(sx, sy, endX, endY);
            context.stroke();
        }
    }

    
    _.Wave.prototype.isActi=function(){return this._com.acti}
    _.Wave.prototype.isRun=function(){return true}
})(LIM.SCENE)