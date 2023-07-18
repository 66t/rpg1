var queryString = window.location.search;
queryString = queryString.substring(1);
var parameters = {};
var pairs = queryString.split('&');
for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    parameters[key] = value;
}
var receivedParameter = parameters['param'];


var app = new Vue({
    el: '.container',
    data: {
        lim: '',
        src: ["filter", "glitch"],
        list: ['bit', 'effector', 'handler', 'sound', 'text', 'filter', 'group',
            'vessel', 'window', 'command', 'shape', 'wave', 'fica', 'tube'],
        filters1:null,
        line:false,
        size:[0,0],
        audio:null
    },
    methods: {
        load() {
            window.opener.postMessage(this.lim, '*');
        },
        src1(index) {
            this.src = [index];
            this.filters1=null
        },
        src2(index) {
            this.src = [this.src[0], index];
            switch (this.src[0]){
                case "filter":
                    this.newfiler()
                    ;break
            }
        },
        src3(index) {
            this.src = [this.src[0],this.src[1], index];
        },
        src4(index) {
            this.src = [this.src[0],this.src[1],this.src[2],index];
        },
        src5(index) {
            this.src = [this.src[0],this.src[1],this.src[2],this.src[3],index];
        },
        push(type){
            switch (type){
                case "filterWave":
                    let i=0
                    while (this.D_tree[1].wave['new_'+i]) i++
                    this.D_tree[1].wave['new_'+i]={cor:true,type:"seed",val:0}
                    this.src3('wave');
                    this.src4('new_'+i);
                    break
                case "filterWavearr":
                    this.D_tree[3].push({
                        count:"add",val1:0,val2:0,frame:0,
                        phase:0,wave:304,freq:2,digit:true,sample:1,reve:false
                    });
                    this.src[4]=this.D_tree[3].length-1
                    break
            }
            this.$forceUpdate();
        },

        srcindex(index) {
            this.src.splice(index+1)
            this.$forceUpdate();
        },
        json(){
            let txt=JSON.stringify(this.lim)

            let tempTextarea = document.createElement('textarea');
            tempTextarea.value = txt;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);

            window.opener.postMessage(txt, '*');
        },
        removeArr(index){
           if(this.src[index]!=null) {
               this.D_tree[index - 1].splice(this.src[index],1)
               if(this.D_tree[index - 1].length===0) this.src.splice(index)
               else if(this.src[index]>=this.D_tree[index - 1].length) 
                   this.src[index]=this.D_tree[index - 1].length-1
           }
        },
        remove(index){
            if(this.src.length<index) return
            let arr=[]
            for(let key in this.D_tree[index-1]) arr.push(key)
            let i=arr.indexOf(this.src[index])
            if(i+1<arr.length) i+=1
            else i-=1
            delete this.D_tree[index-1][this.src[index]]
            this.src.splice(index)
            if(i>-1) this.src.push(arr[i])
        },
        add(){
            let i=0
            while (this.D_tree[0]['new_'+i]) i++

            switch (this.src[0]){
                case "bit":
                    this.D_tree[0]['new_'+i]=['','',0,true]
                    this.src.splice(1)
                    this.src.push("new_"+i)
                break
                case "filter":
                    this.D_tree[0]['new_'+i]=LIM.ENTITY.SceneFilter()
                    this.src.splice(1)
                    this.src.push("new_"+i)
                    this.filters1=null
                break
            }
        },
        ediid(index){
            let oldId=this.src[index]
            let id=event.target.value
            let data= JSON.stringify(this.D_tree[index-1][oldId])
            if(id&&!this.D_tree[index-1][id]) {
                delete this.D_tree[index-1][oldId]
                this.D_tree[index-1][id] = JSON.parse(data)
                this.src[index] = id
            }
            this.$forceUpdate();
        },
        newfiler(){
            let a= ()=>{switch (this.D_tree[1].type) {
                case "adj": return new PIXI.filters.AdjustmentFilter()
                case "bloom": return new PIXI.filters.AdvancedBloomFilter()
                case "ascii": return new PIXI.filters.AsciiFilter()

                case "bulge": return new PIXI.filters.BulgePinchFilter()

                case "convo": return new PIXI.filters.ConvolutionFilter()
                case "colorRep": return new PIXI.filters.ColorReplaceFilter()
                case "cross": return new PIXI.filters.CrossHatchFilter()
                case "crt": return new PIXI.filters.CRTFilter()

                case "dot": return new PIXI.filters.DotFilter()
                case "emboss": return new PIXI.filters.EmbossFilter()
                case "glitch": return new PIXI.filters.GlitchFilter()
                case "glow": return new PIXI.filters.GlowFilter()
                case "godray": return new PIXI.filters.GodrayFilter()
                case "kawa": return new PIXI.filters.KawaseBlurFilter()
                case "motion": return new PIXI.filters.MotionBlurFilter([100,100],3,10)

                case "old": return new PIXI.filters.OldFilmFilter()
                case "outline": return new PIXI.filters.OutlineFilter()
                case "pixel": return new PIXI.filters.PixelateFilter()
                case "radial": return new PIXI.filters.RadialBlurFilter(100,{x:0,y:0})
                case "rgb": return new PIXI.filters.RGBSplitFilter([0,0],[0,0],[0,0])

                case "shock": return new PIXI.filters.ShockwaveFilter()
                case "tiltX": return new PIXI.filters.TiltShiftXFilter()
                case "tiltY": return new PIXI.filters.TiltShiftYFilter()
                case "twist": return new PIXI.filters.TwistFilter()
                case "zoom": return new PIXI.filters.ZoomBlurFilter()
            }}
            let f= a()
            let w=JSON.parse(JSON.stringify(this.D_tree[1].uniforms))
            this.D_tree[1].uniforms={}
            for(let key of Object.keys(f.uniforms)) {
                if(key!=='displacementMap'){
                    let k=key
                    let v=f.uniforms[key]
                    if(v instanceof Object){
                        for(let key1 in v){
                            this.D_tree[1].uniforms[k+"."+key1]=w[k+'.'+key1]||v[key1]
                        }
                    }
                    else this.D_tree[1].uniforms[k]=w[k]||v
                }
            }
            this.$forceUpdate();
        },

        exCor(bool){
            if(bool) {
                this.D_tree[2][this.src[3]] = {cor: true, type: "seed", val: 0}
                this.src4(this.src[3]);
                this.$forceUpdate();
            }
            else
            {
                this.D_tree[2][this.src[3]]=[];
                this.src4(this.src[3]);
                this.$forceUpdate();
                
                
                let that=this
                setTimeout(function (){
                    that.lineData(that.D_tree[3],that.D_tree[1].cycle)
                },100)
               
            }
        },
        lineData(data,time){
            if(data instanceof  Array) {
                let arr = []
                time = time || 1000
                for (let i = 0; i < time + 1; i++)
                    arr.push(LIM.UTILS.waveArr(0, [time, i], data))

                this.line = true
                let min = Math.min(...arr)
                let max = Math.max(...arr)
                let r = 700 / (max - min)

                setTimeout(function () {
                    const canvas = document.getElementById("line");
                    const context = canvas.getContext('2d');
                    canvas.width = 800;
                    canvas.height = 800;
                    const width = canvas.width;
                    const height = canvas.height;
                    context.lineWidth = 1;
                    for (let i = 0; i < 3; i++) {
                        context.beginPath();
                        context.strokeStyle = '#4f4';
                        context.moveTo(0, ((max - min) / (2) * i * r + 50));
                        context.lineTo(800, ((max - min) / (2) * i * r + 50));
                        context.stroke();
                        context.fillStyle = '#4f4';
                        context.font = '45px Arial';
                        context.fillText((((max - min) / (2) * i) + min).toFixed(4), 0, 800 - ((max - min) / (2) * i * r + 50))
                    }

                    for (let i = 1; i < 8; i++) {
                        context.beginPath()
                        context.strokeStyle = '#4f4';
                        context.moveTo(i * 100, 0);
                        context.lineTo(i * 100, 800);
                        context.stroke();
                    }

                    for (let i = 0; i < arr.length - 1; i++) {
                        context.beginPath();
                        context.strokeStyle = '#fff';
                        context.lineWidth = 4;
                        context.moveTo(i * 600 / time + 100, 800 - ((arr[i] - min) * r + 50));
                        context.lineTo((i + 1) * 600 / time + 100, 800 - ((arr[i + 1] - min) * r + 50));
                        context.stroke();
                    }
                }, 100)
            }
        }
    },
    created: function () {
        this.lim = JSON.parse(receivedParameter);
    },
    computed: {
        /**数据树*/
        D_tree() {
            let arr = [];
            let src = [];
            for (let q of this.src) {
                let b = this.lim;
                src.push(q);
                for (let p of src) {
                    b = b[p];
                }
                if (b != null) {
                    arr.push(b);
                }
            }
            return arr;
        },
        /**数据树的最后一个节点*/
        D_final() {
            return this.D_tree[this.D_tree.length - 1];
        },
        /**数据树最后一个节点的第一个值*/
        D_first() {
            for (let item in this.D_final) {
                return item;
            }
        },
        /**拼接当前路径*/
        D_srcName() {
            return this.src.reduce((name, item) => name += "/" + item, "");
        },
    }
});

var backgroundImage = document.getElementById('backgroundImage');
backgroundImage.onload = function() {
    var divElement = document.getElementById("imageContainer")
    if(divElement.clientWidth<this.width||divElement.clientHeight<this.height)
        divElement.style.backgroundSize = 'contain'
    else  divElement.style.backgroundSize = 'auto'
    console.log(app)
    app.size=[this.width,this.height]
};