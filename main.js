//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload =  function () {
    //SceneManager.run(Scene_Boot);
    LIM.$data = new LIM.STORAGE.Data()
    LIM.$bool = new LIM.STORAGE.Bool()
    LIM.$story =new LIM.STORAGE.Story()
    LIM.$number = new LIM.STORAGE.Number()
    SceneManager.run(LIM.SCENE.Scene, "test")

};
