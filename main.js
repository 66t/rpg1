//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload =  function () {
    //SceneManager.run(Scene_Boot);
    SceneManager.run(LIM.SCENE.Scene, "title");
    LIM.$data = new LIM.STORAGE.Data()
    LIM.$bool = new LIM.STORAGE.Bool()
    LIM.$number = new LIM.STORAGE.Number()
};
