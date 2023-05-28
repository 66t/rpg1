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
    Conductor.play("v1",2)
    Conductor.play("v2",1)
};
