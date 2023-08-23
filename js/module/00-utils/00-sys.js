//===========================
// @-00-sys
// @Path      js/module/00-utils
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/26)
// ©2023 limpid
//===========================
//修改场景管理
SceneManager.setupErrorHandlers = function() {
    window.addEventListener('error', this.onError.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
};
SceneManager.initInput = function() {
    TouchInput.initialize();
};
SceneManager.updateInputData = function() {
    LIM.INPUT.update();
    TouchInput.update();
};
SceneManager.setupErrorHandlers = function() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this)); // 添加blur事件监听器
}
SceneManager.onKeyDown = function({ keyCode }) {
    if (keyCode === 123) return;
    LIM.INPUT.registerCode(keyCode)
};
SceneManager.onKeyUp = function({ keyCode }) {
    if (keyCode === 123) return;
    LIM.INPUT.releaseCode(keyCode)
};
SceneManager.onBlur = function() {LIM.INPUT.codeTable={}};

DataManager._databaseFiles = [
    {name: '$dataRole',       src: 'LIM_Role.json'},
    {name: '$dataTree',       src: 'LIM_Tree.json'},
    {name: '$dataLink',       src: 'LIM_Map.json'},
];
Graphics._createGameFontLoader = function() {
    this._createFontLoader('GameFont');
    this._createFontLoader('text');
    this._createFontLoader('name');
};
Scene_Boot.prototype.isGameFontLoaded = function() {
    if (Graphics.isFontLoaded('GameFont')&&Graphics.isFontLoaded('text')&&Graphics.isFontLoaded('name')) {
        return true;
    } else if (!Graphics.canUseCssFontLoading()){
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= 60000) {
            throw new Error('Failed to load GameFont');
        }
    }
};
document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e&& e.keyCode===116) location.reload();
};

