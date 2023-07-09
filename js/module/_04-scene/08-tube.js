//===========================
// @-08-Tube
// @Path      js/module/04-scene
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/24)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
((_)=> {
    _.Tube = function () {
        this.initialize.apply(this, arguments)
    }
    _.Tube.prototype = Object.create(Sprite.prototype)
    _.Tube.prototype.constructor = _.Tube;
    Object.defineProperties(_.Tube.prototype, {
        _index: {
            get: function () {
                return this._com.index||0;
            },
            configurable: true
        }
    });
    _.Tube.prototype.initialize = function (origin, name, com) {
        this._com=com
        this._name=name
        this._origin=origin
        this._time=0
        this._run =0;
        //文字
        this._txt=[]
        //演员
        this._per={}
        //字素
        this._grapheme=[]
        Sprite.prototype.initialize.call(this);//;
        this._anime=0
        
        this.bitmap=new Bitmap(Graphics.width,Graphics.height)
        
        this.box=new Bitmap(LIM.UTILS.lengthNum(com.w),LIM.UTILS.lengthNum(com.h))
        this.brand=[new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280)]
        this.source=[new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280)]
    }
    _.Tube.prototype.darwBox=function (){
        let color="#"+this._per.color
        this.box.fillAll(color)
        this.box.gradientFillRect(4,4,this.box.width-8,this.box.height-8,"#fff2","#fff",false)
        let x=this.box.width-12
        let y=this.box.height-12
        for(let i=0;i<x/2;i++)
            for(let j=0;j<y/2;j++)
                switch ((i*y+j)%3){
                    case 0:
                        this.box.fillRect(i*2+6,j*2+6,1,1,"#f00a")
                        break
                    case 1:
                        this.box.fillRect(i*2+6,j*2+6,1,1,"#0f0a")
                        break
                    case 2:
                        this.box.fillRect(i*2+6,j*2+6,1,1,"#00fa")
                        break
                }
        this.box.gradientFillRect(4,4,this.box.width-8,this.box.height-8,color,color+"88",true)
        this.box.fillRect(10,10,this.box.width-20,this.box.height-20,"#fffa")
    }
    
    _.Tube.prototype.update=function(){
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            this.refresh()
            this._time++;
        }
    }
    
    _.Tube.prototype.refresh = function () {
        if(this.isRun(0)) this.readTxt(this._txt)
        if(this.isRun(1)) this.drawPrint()
        if(this.isRun(2)) this.fadeIn()
        if(this.isRun(3)) this.execute()
    }

    //提取字素
    _.Tube.prototype.readTxt=function (txt){
        if(this.isRun(0))  this.setRun(0,false)
        let x = 0
        let y = 0
        for (let i = 0; i < txt.length; i++) {
            x = 0
            let s = txt[i].split("")
            for (let j = 0; j < s.length&&x<55; j++) {
                let l = /[^\x00-\xff]/.test(txt[i][j]) ? 2 : 1
                this._grapheme[x+y*55]=this.getGrapheme(txt[i][j])
                x += l
            }
            y++
        }
        this.setRun(1,true)
    }
    _.Tube.prototype.getGrapheme = function(txt) {
        let bit =new Bitmap(128,128)
        bit.fontSize=64
        bit.fontFace = 'text';
        bit.drawText(txt,0,0,96,96,"center")

        let  width = bit.width;
        let  height = bit.height;
        let  data=[]
        let  d = bit._context.getImageData(0, 0, width,height).data;
        let  alphaMatrix = [];
        let  row = [];
        for (let i = 0; i < d.length; i += 4) {
            let  alpha = d[i + 3];
            row.push(alpha);
            if (row.length === width) {
                alphaMatrix.push(row);
                row = [];
            }
        }


        for(let x=0;x<48;x++){
            data[x]=[]
            for(let y=0;y<48;y++){
                data[x][y] = 0
                data[x][y] += alphaMatrix[y * 2][x * 2]
                data[x][y] += alphaMatrix[y * 2 + 1][x * 2]
                data[x][y] += alphaMatrix[y * 2 + 1][x * 2 + 1]
                data[x][y] += alphaMatrix[y * 2][x * 2 + 1]
                if(data[x][y]>0&&(x*y===0||x===47||y===47)) data[x][y] = 1
            }
        }
        return data;
    };

    
    //渐入
    _.Tube.prototype.fadeIn=function (){
        this.setRun(2,false)
        this.setRun(3,true)
        this._anime=60
    }
    _.Tube.prototype.execute=function (){
        this.bitmap.clear()
        if(this._anime>-1){
            this.alpha=(60-this._anime--)/60
            this.bitmap.blt(this.box, 0, 0,
                this.box.width, this.box.height,
                LIM.UTILS.lengthNum(this._com.x), LIM.UTILS.lengthNum(this._com.y),
                this.box.width*this.alpha, this.box.height*this.alpha
            )
        }
        else {
            this.bitmap.blt(this.box, 0, 0, this.box.width, this.box.height, LIM.UTILS.lengthNum(this._com.x), LIM.UTILS.lengthNum(this._com.y))
        }
    }



    //渲染原始字型
    _.Tube.prototype.drawPrint = function (){
        if(this.isRun(1))  this.setRun(1,false)
        this.source[0].clear()
        this.source[1].clear()
        this.source[2].clear()
        this.source[3].clear()
        this.source[4].clear()

        for(let index in this._grapheme){
            let sx=24*(index%55)
            let sy=48*Math.round(index/55)
            let grapheme =this._grapheme[index]
            for(let x=0;x<grapheme.length;x++) {
                let arr1 = [];
                let arr=[]
                for (let y = 0; y < grapheme[x].length; y++) arr1.push(y);
                arr = arr.concat(
                    arr1.filter((i) => { return i % 7 === 0 }),
                    arr1.filter((i) => { return i % 7 === 1 }),
                    arr1.filter((i) => { return i % 7 === 2 }),
                    arr1.filter((i) => { return i % 7 === 3 }),
                    arr1.filter((i) => { return i % 7 === 4 }),
                    arr1.filter((i) => { return i % 7 === 5 }),
                    arr1.filter((i) => { return i % 7 === 6 }),
                );

                let z=Math.round(arr.length/5)
                for (let i = 0; i < arr.length; i++) {
                    if (grapheme[x][arr[i]] > 220) {
                        if(i<z)    this.source[0].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 5.65, 5.65, "#3ae8")
                        if(i<z*2)  this.source[1].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 5.65, 5.65, "#3ae8")
                        if(i<z*3)  this.source[2].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 5.65, 5.65, "#3ae8")
                        if(i<z*4)  this.source[3].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 5.65, 5.65, "#3ae8")
                        this.source[4].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 5.65, 5.65, "#3ae8")
                    }
                    else if (grapheme[x][arr[i]] > 0) {
                        if(i<z)    this.source[0].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 7.5, 7.5, "#0002")
                        if(i<z*2)  this.source[1].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 7.5, 7.5, "#0002")
                        if(i<z*3)  this.source[2].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 7.5, 7.5, "#0002")
                        if(i<z*4)  this.source[3].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 7.5, 7.5, "#0002")
                        this.source[4].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 7.5, 7.5, "#0002")
                    }
                    if (grapheme[x][arr[i]] > 1000) {
                        if(i<z)    this.source[0].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 4.05, 4.05, "#091c27cc")
                        if(i<z*2)  this.source[1].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 4.05, 4.05, "#091c27cc")
                        if(i<z*3)  this.source[2].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 4.05, 4.05, "#091c27cc")
                        if(i<z*4)  this.source[3].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 4.05, 4.05, "#091c27cc")
                        this.source[4].fillRect((x + sx) * 4, (arr[i] + sy) * 4, 4.05, 4.05, "#091c27cc")
                    }
                }
            }
        }


        this.darwBox()
        console.log(this._per)
        
        
        this.brand[0].fontSize=48
        this.brand[0].fontFace = 'name';
        this.brand[0].outlineWidth = 9;
        this.brand[0].outlineColor = "#"+this._per.color;
        let t1= this.brand[0].measureTextWidth(this._per.name)
        this.brand[0].fontSize=18
        let t2= this.brand[0].measureTextWidth(this._per.notation)
        let w=Math.max(t1,t2)
        this.brand[0].fontSize=48
        this.brand[0].drawText(this._per.name,50,0,w,96,"center")
        this.brand[0].fontSize=18
        this.brand[0].outlineWidth = 5;
        this.brand[0].drawText(this._per.notation,50,80,w,24,"center")
        
        
        this.addChild(new Sprite(this.brand[0]))
    }

    _.Tube.prototype.isActi=function(){return this._com.acti}
    _.Tube.prototype.isRun=function(bit){return LIM.UTILS.atBit(this._run,bit)}
    _.Tube.prototype.setRun=function(bit,bool){
        this._run = LIM.UTILS.setBit(this._run,bit,bool);
    }


})(LIM.SCENE)