//===========================
// @-07-Fractal
// @Path      js/module/04-scene
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/24)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=> {
    _.Fractal = function () {
        this.initialize.apply(this, arguments)
    }
    _.Fractal.prototype = Object.create(Sprite.prototype)
    _.Fractal.prototype.constructor = _.Fractal;
    Object.defineProperties(_.Fractal.prototype, {
        _index: {
            get: function () {
                return this._com.index||0;
            },
            configurable: true
        }
    });
    _.Fractal.prototype.initialize = function (origin, name, com) {
        this._com=com
        this._name=name
        this._origin=origin
        this._time=0
        Sprite.prototype.initialize.call(this);//;
        this.shape()
    }
    _.Fractal.prototype.update = function () {
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
        }
    }
    _.Fractal.prototype.shape=function(){
        this.anchor.set(0.5, 0.5);
        this.x = Graphics.width * 0.5 + LIM.UTILS.lengthNum(this._com.x);
        this.y = Graphics.height * 0.5 + LIM.UTILS.lengthNum(this._com.y);
        this.rotation = this._com.rota / 180 * Math.PI;
        this.alpha = this._com.alpha;
        this.bitmap=new Bitmap(LIM.UTILS.lengthNum(this._com.w),LIM.UTILS.lengthNum(this._com.h))
    }


    _.Fractal.prototype.refresh = function () {
        this._com.acti=false
        this.bitmap.clear()
        this.ctx = this.bitmap.context;
        this.ctx.lineWidth=this._com.line
        const promise = new Promise((resolve) => {
            let min=Math.min(this.height,this.width)
            let depth=1+Math.floor(this._time/this._com.depth)%2==1?this._com.depth-(this._time%this._com.depth):(this._time%this._com.depth)
                switch (this._com.mode){
                    case 0:
                    case "0":
                        this.recurSierpinski((this.width-min)/2, (this.height-min)/2, min, depth);
                        break
                    case 1:
                    case "1":
                        this.recurDragonCurve(this.width/1.4, this.height/1.41,min/2.2,-Math.PI / 2, depth)
                        break
                    case 2:
                    case "2":
                        this.recurFractalTree(this.width/2, this.height-(min/9),min/9,-Math.PI / 2, depth)
                        break
                    case 3:
                    case "3":
                        this.recurPoincareDisk(this.width/2, this.height/2,min/9, depth)
                        break
                    case 4:
                    case "4":
                        this.recurElectron(this.width/2, this.height/2,min/3, depth)
                        break
                    case 5:
                    case "5":
                        this.recurKochCurve(this.width/20, this.height/2.5,this.width/20*19,this.height/2.5, depth)
                        break
                }
                resolve();
            });
        promise.then(() => {
            
              setTimeout(()=>{ this._com.acti=true;},170)
            
        });
    };
    
    _.Fractal.prototype.drawSierpinski=function(x, y, size,height) {
        const x1 = x;
        const y1 = y + height;
        const x2 = x + size / 2;
        const y2 = y;
        const x3 = x + size;
        const y3 = y + height;
        this.ctx.strokeStyle =  "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    _.Fractal.prototype.recurSierpinski = function (x, y, size, depth) {
        const height = size * Math.sqrt(3) / 2;
        if (depth === 0) this.drawSierpinski(x, y, size, height);
        else {
            const promise1 = new Promise((resolve) => {
                this.recurSierpinski(x, y, size / 2, depth - 1);
                resolve();
            });
            const promise2 = new Promise((resolve) => {
                this.recurSierpinski(x + size / 4, y + height / 2, size / 2, depth - 1);
                resolve();
            });
            const promise3 = new Promise((resolve) => {
                this.recurSierpinski(x + size / 2, y, size / 2, depth - 1);
                resolve();
            });
            return Promise.all([promise1, promise2, promise3]);
        }
    }
    
    _.Fractal.prototype.drawDragonCurve=function (x,y,length,angle) {
        this.ctx.strokeStyle = "#fff"
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        this.ctx.strokeStyle =  "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }
    _.Fractal.prototype.recurDragonCurve=function (x, y, length, angle,depth) {
        const newLength = length / Math.sqrt(2);
        const angle1 = angle - Math.PI / 4;
        const angle2 = angle + Math.PI / 4;
        if (depth === 0) this.drawDragonCurve(x,y,length,angle);
        else {
            const promise1 = new Promise((resolve) => {
                this.recurDragonCurve(x,y,newLength,angle1,depth-1);
                resolve();
            });
            const promise2 = new Promise((resolve) => {
                this.recurDragonCurve(
                    x + Math.cos(angle1) * newLength, 
                    y + Math.sin(angle1) * newLength,
                    newLength,
                    angle2,
                    depth - 1);
                resolve();
            });
            return Promise.all([promise1, promise2]);
        }
    }
    
    _.Fractal.prototype.drawFractalTree=function (x,x2, y,y2, length, angle, depth) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle =  "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.ctx.lineWidth = depth*this._com.line;
        this.ctx.stroke();
    }
    _.Fractal.prototype.recurFractalTree=function (x,y,length,angle,depth) {
        if (depth === 0) return 
        else {
            const x2 = x + Math.cos(angle) * length;
            const y2 = y + Math.sin(angle) * length;
            this.drawFractalTree(x,x2,y,y2,length,angle,depth);
            const promise1 = new Promise((resolve) => {
                this.recurFractalTree(x2, y2, length, angle-0.4, depth - 1);
                resolve();
            });
            const promise2 = new Promise((resolve) => {
                this.recurFractalTree(x2, y2, length, angle+0.4, depth - 1);
                resolve();
            });
            return Promise.all([promise1, promise2]);
        }
    }


    _.Fractal.prototype.drawPoincareDisk=function (x,y,radius,depth) {
        this.ctx.strokeStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();

        // 绘制内部圆
        const innerRadius = radius / 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    _.Fractal.prototype.recurPoincareDisk=function (x, y, radius, depth) {
        if (depth <= 0) return;

        this.drawPoincareDisk(x, y, radius, depth);

        const childRadius = radius * 0.615;
        const childDistance = radius - childRadius+10;

        const promise1 = new Promise((resolve) => {
            this.recurPoincareDisk(x + childDistance, y, childRadius, depth - 1);
            resolve();
        });
        const promise2 = new Promise((resolve) => {
            this.recurPoincareDisk(x - childDistance, y, childRadius, depth - 1);
            resolve();
        });
        const promise3 = new Promise((resolve) => {
            this.recurPoincareDisk(x, y + childDistance, childRadius, depth - 1);
            resolve();
        });
        const promise4 = new Promise((resolve) => {
            this.recurPoincareDisk(x, y - childDistance, childRadius, depth - 1);
            resolve();
        });

        return Promise.all([promise1, promise2, promise3, promise4]);
    }


    _.Fractal.prototype.drawElectron=function (x,y,length,depth) {
      
        this.ctx.beginPath();
        this.ctx.lineWidth=this._com.line*depth
        this.ctx.strokeStyle =  "#" + Math.floor(Math.random() * 16777215).toString(16);
      
        
        this.ctx.moveTo(x-length, y);
        this.ctx.lineTo(x,y-length);
        
        this.ctx.moveTo(x-length, y);
        this.ctx.lineTo(x, y+length);

       
        this.ctx.moveTo(x+length,y);
        this.ctx.lineTo(x,y-length);
        
        this.ctx.moveTo(x+length,y);
        this.ctx.lineTo(x, y+length);
     
        
        this.ctx.stroke();
    }
    _.Fractal.prototype.recurElectron=function (x, y, length, depth,q) {
        if (depth < 0) return;
        this.drawElectron(x,y,length,depth)

        const childlength = length*0.718;
        
        const promise1 = new Promise((resolve) => {
            if(!q||(q===2))
            this.recurElectron(x + length/1.75, y-length/1.75, childlength, depth - 1,1);
            resolve();
        });
        const promise2 = new Promise((resolve) => {
            if(!q||(q===3))
            this.recurElectron(x - length/1.75, y+length/1.75, childlength, depth - 1,2);
            resolve();
        });
        const promise3 = new Promise((resolve) => {
            if(!q||(q===4))
            this.recurElectron(x+length/1.75, y + length/1.75, childlength, depth - 1,3);
            resolve();
        });
        const promise4 = new Promise((resolve) => {
            if(!q||(q==1))
            this.recurElectron(x-length/1.75, y - length/1.75, childlength, depth - 1,4);
            resolve();
        });
       return Promise.all([promise1, promise2, promise3, promise4]);
    }

    _.Fractal.prototype.drawKochCurve=function (x1, y1, x2, y2) {

       this.ctx.beginPath();
       this.ctx.strokeStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        
        this.ctx.moveTo(x1- (x2 - x1) / 3, y1-(y2 - y1) / 3);
        this.ctx.lineTo(x2- (x2 - x1) / 3, y2-(y2 - y1) / 3);     
        this.ctx.stroke();
    }
    _.Fractal.prototype.recurKochCurve = function (x1, y1, x2, y2, depth) {
        if (depth < 0) {
            this.drawKochCurve(x1, y1, x2, y2);
            return Promise.resolve();
        }

        const deltaX = (x2 - x1) / 3;
        const deltaY = (y2 - y1) / 3;
        const xA = x1 + deltaX;
        const yA = y1 + deltaY;
        const xC = x1 + 2 * deltaX;
        const yC = y1 + 2 * deltaY;
        const xB = (xC - xA) * Math.cos(Math.PI / 3) - (yC - yA) * Math.sin(Math.PI / 3) + xA;
        const yB = (xC - xA) * Math.sin(Math.PI / 3) + (yC - yA) * Math.cos(Math.PI / 3) + yA;

        const promises = [];

        promises.push(this.recurKochCurve(xA, yA, x1, y1, depth - 1));
        promises.push(this.recurKochCurve(xA, yA, xB, yB, depth - 1));
        promises.push(this.recurKochCurve(xB, yB, xC, yC, depth - 1));
        promises.push(this.recurKochCurve(x2, y2, xC, yC, depth - 1));
        return Promise.all(promises);
    };
    
    _.Fractal.prototype.isActi=function(){return this._com.acti}
    _.Fractal.prototype.isRun=function(){return true}
    
})(LIM.SCENE)