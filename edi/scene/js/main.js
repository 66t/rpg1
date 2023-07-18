var $data={}
var $vue;

var page=  ['bit', 'effector', 'handler', 'sound', 'text', 'filter', 'group',
    'vessel', 'window', 'command', 'shape', 'wave', 'fica', 'tube']
var btn = ["load","json"]
function init() {
    $vue=new Vue({
        el: '#window',
        data:{
            basedata:$data,//数据源
            src:[],
            img_size:[],
            audio_time:0,
            audio:null,
            json:false
        },
        mixins:[bris.handle()],
        methods:{
            F_refresh() {
                let s=this.src.join("$")
                this.src=[]
                this.src=s.split("$")
                this.$forceUpdate()}
        },
        created: function () {
            document.getElementById("load").remove()
        },
    })
}
window.onload = function() {
    
    let queryString = window.location.search;
    queryString = queryString.substring(1);
    let parameters = {};
    let pairs = queryString.split('&');
    for (let i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        parameters[key] = value;
    }
    $data = JSON.parse(parameters['param']);
    init()
    
    

    
    
    /////图片
    let load_bit = document.getElementById('load_bit');
    var loadBit=function (){
        let divElement = document.getElementById("img_bit")
        if(divElement.clientWidth<load_bit.width||divElement.clientHeight<load_bit.height)
            divElement.style.backgroundSize = 'contain'
        else  divElement.style.backgroundSize = 'auto'
        $vue.img_size=[load_bit.width,load_bit.height]
    }
    load_bit.onload = loadBit
    window.addEventListener('resize', loadBit);
};
