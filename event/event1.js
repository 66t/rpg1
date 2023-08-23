var LIM=LIM||{};
LIM.EVENT=LIM.EVENT||{};

((_)=> {
    _.true=()=>{return true}
    _.false=()=>{return false}
    _.load=()=>{
        DataManager.loadDatabase()
    }
    _.ready=()=>{
        return DataManager.isDatabaseLoaded()&&
               Graphics.isFontLoaded('GameFont')&&
               Graphics.isFontLoaded('text')&&
               Graphics.isFontLoaded('name')
    }

    _.exit=()=>{window.close();}
    _.newgame=()=>{
        SceneManager.run(LIM.TILEMAP.Map, "ff")
       // SceneManager.goto(LIM.SCENE.Scene, "theater")
       // LIM.$story.time=0
    }
    _.reload=()=>{if (Utils.isNwjs()) {location.reload();}}
    _.test=()=>{if (Utils.isNwjs() && Utils.isOptionValid('test')) {require('nw.gui').Window.get().showDevTools();}
        
}

})(LIM.EVENT)