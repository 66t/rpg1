var LIM=LIM||{};
LIM.EVENT=LIM.EVENT||{};

(function(_) {
    _.true=()=>{return true}
    _.false=()=>{return false}
    _.load=()=>{
        DataManager.loadDatabase()
        ConfigManager.load()
    }
    _.ready=()=>{return DataManager.isDatabaseLoaded()&&Graphics.isFontLoaded('GameFont')}
})(LIM.EVENT)