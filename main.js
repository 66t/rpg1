//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload = function() {
    //SceneManager.run(Scene_Boot);
    SceneManager.run(LIM.SCENE.Scene,"test");
    LIM.$data=new LIM.STORAGE.Data()
    LIM.$bool=new LIM.STORAGE.Bool()
    LIM.$number=new LIM.STORAGE.Number()
    
    LIM.$data.pro(1,1000)
    LIM.$data.pro(1,2000)
    LIM.$data.pro(1,5000)
    LIM.$data.pro(1,10000)
    LIM.$data.pro(1,7000)
    LIM.$data.pro(1,8000)
    Conductor.play("v2")
};
