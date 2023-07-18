//===========================
// @-load.js
// @author    清澈淌漾
// @email      einatu@yeah.net
// @version   Date(2023/1/18 10:15)
// ©2023 limpid
//===========================
// 加载模块
var LIM=LIM||{};//;
LIM.module=[
    {src:"js",data:[ 
        {src:"libs",data:[
            {src:"pixi"},{src:"pixi-filters"},{src:"pixi-tilemap"},{src:"pixi-picture"},
            {src:"fpsmeter"},{src:"crypto-js.min"},{src:"iphone-inline-video.browser"},{src:"tone"}]},
        {src:"rpg_core"},
        {src:"rpg_managers"},
        {src:"rpg_objects"},
        {src:"rpg_scenes"},
        {src:"rpg_sprites"},
        {src:"rpg_windows"},
        {src:"plugins"},
        {src:"module",data:[
            {src:"00-utils",data:[{src:"01-string"},{src:"02-math"},{src:"03-algorithm"},{src:"04-keyInput"},{src:"05-entity"},{src:"00-sys"}]},
            {src:"01-storage",data:[{src:"01-main"},{src:"02-save"},{src:"03-boolean"},{src:"04-number"},{src:"05-story"}]},
            {src:"02-audio",data:[{src:"01-conductor"}]},
            {src:"03-scene",data:[{src:"01-scene"},{src:"02-filter"}]},
            {src:"10-rogue",data:[{src:"01-main"},{src:"02-room"}]}
        ]}]},
    {src:"event",data:[{src:"event1"}]},
    {src:"main"}
]
LIM.moduleManager={}
LIM.moduleManager._path         = '';
LIM.moduleManager._scripts      = [];
LIM.moduleManager._errorUrls    = [];
LIM.moduleManager.setup = function(modules,src) {
    modules.forEach((module)=>{
        if (module.data) LIM.moduleManager.setup(module.data,src+"/"+module.src)
        else {
            let name=src+"/"+module.src+'.js'
            this.loadScript(name);
            this._scripts.push(name);
        }
    }, this);
};
LIM.moduleManager.loadScript = function(url) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script._url = url;
    script.onerror = this.onError.bind(this);
    document.body.appendChild(script);
};
LIM.moduleManager.onError = function(e) {this._errorUrls.push(e.target._url);};

try {
    let path = require('path');
    let base = path.dirname(process.mainModule.filename);
    LIM.moduleManager.setup(LIM.module, base);
}
catch (e){
    LIM.moduleManager.setup(LIM.module, "");
}


