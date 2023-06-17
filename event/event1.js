var LIM=LIM||{};
LIM.EVENT=LIM.EVENT||{};

(function(_) {
    _.true=()=>{return true}
    _.false=()=>{return false}
    _.load=()=>{
        DataManager.loadDatabase()
    }
    _.exit=()=>{window.close();}
    _.ready=()=>{return DataManager.isDatabaseLoaded()&&Graphics.isFontLoaded('GameFont')}
    _.reload=()=>{if (Utils.isNwjs()) {location.reload();}}
    _.test=()=>{if (Utils.isNwjs() && Utils.isOptionValid('test')) {require('nw.gui').Window.get().showDevTools();}
        
}

})(LIM.EVENT)