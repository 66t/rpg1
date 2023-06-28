//===========================
// @-06-Tube
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
        
        this.txt=[
            '足りないもの なーんだ',
            '僕らの人生',
            '正解どこなんだ 探せよ探せ',
            '例外ない 二進も三進も',
            '零下以内なら 劣化以外ない',
            '正味クソゲーだ カラ空回れ',
            '倦怠モード「苦」だ',
            '僕らの人生',
            '校内猛毒だ 屈めよ屈め',
            '盛大knight',
            '和気あいゴッコは成敗die by',
            '生産性ない'
        ]
        this.grapheme=[]
        
        Sprite.prototype.initialize.call(this);//;
        this.bitmap=new Bitmap(4888,2600)
        this.source=[new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280),new Bitmap(5280,5280)]
        
        this.x=71.5
        this.y=0
    }
    _.Tube.prototype.update=function(){
        if(this.isActi()) {
            Sprite.prototype.update.call(this);
            
            this._time++;
        }
    }

    _.Tube.prototype.readTxt=function (txt){
        let x = 0
        let y = 0
        for (let i = 0; i < txt.length; i++) {
            x = 0
            let s = this.txt[i].split("")
            for (let j = 0; j < s.length; j++) {
                let l = /[^\x00-\xff]/.test(this.txt[i][j]) ? 2 : 1
                this.drawFont()
                this.grapheme[x]=this.getGrapheme(this.txt[i][j])
                x += l
            }
            y++
        }
    }
    _.Tube.prototype.getGrapheme = function(txt) {
        let bit =new Bitmap(96,96)
        bit.fontSize=60
        bit.fontFace = 'Font1';
      
        
        bit.drawText(txt,0,0,96,96)
        let  width = bit.width;
        let  height = bit.height;
        let  data=[]
        let  d = bit._context.getImageData(0, 0, width,height).data;
        var  alphaMatrix = [];
        var  row = [];
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
                 if(data[x][y]>0&&(x*y===0||x===47||y===47))
                  data[x][y] = 1
            }
        }
        return data;
    };
    _.Tube.prototype.drawFont= function (grapheme,index,r){
        let sx=24*(index%55)
        let sy=48*parseInt(index/55)
        for(let x=0;x<grapheme.length;x++)
            for (let y =0;y<grapheme[x].length;y++) {
                if(r&&Math.random()<r) continue
                if (grapheme[x][y] > 400)
                    this.bitmap.fillRect((x+sx) * 4, (y+sy) * 4, 9.65, 9.65, "#3ae8")
                else if (grapheme[x][y] > 0)
                    this.bitmap.fillRect((x + sx) * 4, (y + sy) * 4, 11.5, 11.5, "#0002")
                if (grapheme[x][y] > 800) this.bitmap.fillRect((x + sx) * 4, (y + sy) * 4, 4.05, 4.05, "#091c27cc")
            }
            
    }
    
    _.Tube.prototype.isActi=function(){return this._com.acti}
    _.Tube.prototype.isRun=function(){return true}

})(LIM.SCENE)