String.prototype.replacePlace = function(arr) {return arr.reduce((result, value, i) => result.replace(new RegExp(`%\\[${i + 1}\\]`, 'g'), value), this);};
var bris=bris||{};//;
bris.handle=function () {
    return{
        methods:{
            
            F_handle(handle,data){
                for(let item of handle) {
                    switch (item.id) {
                        case 0:
                            switch (data[0]){
                              case "load":
                                  window.opener.postMessage(0+""+JSON.stringify($data), '*');
                                  break
                              case "json":
                                  this.json=true
                                  break
                            }
                            break
                        case 1:
                               window.opener.postMessage(1+""+JSON.stringify(data), '*');
                            break
                        case 10:
                            this.src.splice(data[0])
                            this.src.push(data[1])
                            if(this.src[0]==="sound"&&data[0]===1) this.F_audioDuration()
                            if(this.src[0]==="filter"&&data[0]===1) this.F_filerUniforms()
                            break
                        case 20:
                            let i=0
                            while (this.D_tree[data[0]]['new_'+i]) i++
                            switch (this.src[0]){
                                case "bit":
                                    this.D_tree[data[0]]['new_'+i]=['','',0,true]
                                    break
                                case "filter":
                                    switch (data[0]){
                                        case 0:
                                            this.D_tree[data[0]]['new_'+i]=LIM.ENTITY.SceneFilter()
                                            break
                                        case 2:
                                            this.D_tree[data[0]]['new_'+i]={cor:true,type:"seed",val:0}
                                            break
                                        case 3:
                                            this.D_tree[data[0]].push({
                                                count:"add",val1:0,val2:0,frame:0,
                                                phase:0,wave:304,freq:2,digit:true,sample:1,reve:false
                                            })
                                            break
                                    }
                                    break
                                case "sound":
                                    this.D_tree[data[0]]['new_'+i]=LIM.ENTITY.Sound()
                                    $vue.audio_time
                                    break
                            }
                            this.src.splice(data[0]+1)
                            this.src.push("new_"+i)
                            break
                        case 30:
                            if(!this.src[data[0]+1]) continue
                            let arr=[]
                            for(let key in this.D_tree[data[0]]) arr.push(key)
                            if(arr.length==0) continue
                            let index=arr.indexOf(this.src[data[0]+1])
                            index+=(index+1<arr.length)?1:-1
                            delete this.D_tree[data[0]][this.src[data[0]+1]]
                            this.src.splice(data[0]+1)
                            if(index>-1) this.src.push(arr[index])
                            break
                        case 31:
                            if(this.src[data[0]+1]!=null) {
                                this.D_tree[data[0]].splice(this.src[data[0]+1],1)
                                if(this.D_tree[data[0]].length===0) this.src.splice(data[0]+1)
                                else if(this.src[data[0]+1]>=this.D_tree[data[0]].length)
                                this.src[data[0]+1]=this.D_tree[data[0]].length-1
                            }
                            break
                        case 40:
                            if(this.$refs[data[0]])
                            this.$refs[data[0]].click();
                            break
                    }
                    this.$forceUpdate()
                }
            },
             
            
            F_bitSrc(event){
                const file = event.target.files[0];
                if (file) {
                    let arr=file.path.split("\\")
                    let i=arr.indexOf("img") 
                    if(i>-1){
                        arr= arr.splice(i)
                        let b= arr.pop().split('.')[0]
                        arr= arr.join("/")
                        this.D_tree[1][0]=arr+'/'
                        this.D_tree[1][1]=b
                        this.$forceUpdate()
                        event.target.value = '';
                    }
                }
            },
            F_soundSrc(event){
                const file = event.target.files[0];
                if (file) {
                    let arr=file.path.split("\\")
                    if(arr.indexOf("audio")>-1) {
                        arr = arr.slice(arr.indexOf("audio") + 1)
                        this.D_tree[1].type=arr[0]
                        this.D_tree[1].name=arr[1].split(".")[0]
                        this.F_audioDuration()
                        this.$forceUpdate()
                    }
                } 
            },
            F_audioDuration() {
                this.audio = new Audio('../../audio/'+this.D_tree[1].type+'/'+this.D_tree[1].name+'.ogg');
                this.audio.addEventListener('loadedmetadata',function() {
                    $vue.audio_time = parseInt($vue.audio.duration)
                });
                this.audio.load();
            },
            F_filerUniforms(){
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
            F_play(){
                let data=this.D_tree[1]
                this.F_handle(handle.play,data)
            },
            ediId(index){
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

            exWave(bool){
                if(bool) {this.D_tree[2][this.src[3]] = {cor: true, type: "seed", val: 0}}
                else {this.D_tree[2][this.src[3]]=[];}
                this.F_handle(handle.src,[3,this.src[3]])
            },
        },
        computed: {
            /**数据树*/
            D_tree() {
                let arr = [];
                let src = [];
                for (let q of this.src) {
                    let b = this.basedata;
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
    }
}



var handle ={
    sys:[{id:0}],
    play:[{id:1}],
    src:[{id:10}],
    additem:[{id:20}],
    subitem:[{id:30}],
    subarr:[{id:31}],
    click:[{id:40}]
}


