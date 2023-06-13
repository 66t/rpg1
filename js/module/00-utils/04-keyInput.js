var LIM = LIM || {};
LIM.INPUT = LIM.INPUT || {};
LIM.INPUT.keyGroup = {};
LIM.INPUT.waitTime = 12;
LIM.INPUT.repeatTime = 20;
LIM.INPUT.inputTime = 60;
LIM.INPUT.keyMapper = {  //功能键
    "116:-1":"reload", 
    "120:-2":"test" ,
}
LIM.INPUT.controlMapper = { //控制键
    "tab":[9],
    "start":[81],
    "home":[87],
    "select":[33],
    "back":[34],
    "a":[13,32,90],
    "b":[88,27,45],
    "x":[17,18],
    "y":[16],
    "up":[38,104],
    "down":[40,98],
    "left":[37,100],
    "right":[39,102],
}
LIM.INPUT.key={}
LIM.INPUT.update = function() {
    const time = Date.now();
    for (const key of Object.keys(LIM.INPUT.keyGroup)) {
        const keyGroup = LIM.INPUT.keyGroup[key];
        let { count, keyTime, upTime } = keyGroup;
        if (count < 0) {
            if (++keyGroup.count === 0) {
                delete LIM.INPUT.keyGroup[key];
                this.keyEvent(key, -2);//重置时
            }
        } 
        else if (keyTime > upTime) {
            if (keyGroup.count%LIM.INPUT.inputTime === 0) {
                this.keyEvent(key, keyGroup.count/LIM.INPUT.inputTime);//按下时
            }
            keyGroup.count++
        }
        else {
            keyGroup.count = ~LIM.INPUT.waitTime;
            this.keyEvent(key, -1);//松开时
        }
    }
    for(const key of Object.keys(LIM.INPUT.controlMapper)){
        if(LIM.INPUT.isInput(key)) LIM.INPUT.key[key]=LIM.INPUT.key[key]+1
        else LIM.INPUT.key[key]=-1
    }
    console.log(LIM.INPUT.getInput("tab",true))
};

LIM.INPUT.keyEvent=function (key,eve){
    if(LIM.INPUT.keyMapper[key+":"+eve])
        LIM.INPUT.trigger(LIM.INPUT.keyMapper[key+":"+eve])
}

LIM.INPUT.control=function (key,down){
    if(down) return LIM.INPUT.key[key]===0 
    else return LIM.INPUT.key[key]%LIM.INPUT.repeatTime===0
}
LIM.INPUT.isInput=function (key){
    if(LIM.INPUT.controlMapper[key])
        for(let k of LIM.INPUT.controlMapper[key])
            if(this.isKeyState(k)>-1) return true
    return false    
}
LIM.INPUT.isKeyState=function (key){
    const keyGroup = LIM.INPUT.keyGroup[key];
    if (keyGroup !== undefined){
        if(keyGroup.count>-1) return parseInt(keyGroup.count/LIM.INPUT.inputTime)
        else return -1
   }
    else return -2
}
LIM.INPUT.trigger=function (eve){
    switch (eve){
        case "reload":
            if (Utils.isNwjs()) {
                location.reload();
            }
            break
        case "test":
            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                require('nw.gui').Window.get().showDevTools();
            }
            break
    }
}

SceneManager.updateInputData = function() {
    LIM.INPUT.update();
    TouchInput.update();
};
SceneManager.setupErrorHandlers = function() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this)); // 添加blur事件监听器
};
SceneManager.onKeyDown = function({ keyCode }) {
    if (keyCode === 123) return;
    const keyGroup = LIM.INPUT.keyGroup[keyCode];
    if (keyGroup !== undefined) {
        if (keyGroup.upTime > keyGroup.keyTime) {
            keyGroup.keyTime = Date.now();
            keyGroup.count = 0;
        }
    } else {
        LIM.INPUT.keyGroup[keyCode] = { keyTime: Date.now(), upTime: -1, count: 0 };
    }
};
SceneManager.onKeyUp = function({ keyCode }) {
    const keyGroup = LIM.INPUT.keyGroup[keyCode];
    if (keyGroup !== undefined) {
        keyGroup.upTime = Date.now();
    }
};
SceneManager.onBlur = function() {
    for (const key of Object.keys(LIM.INPUT.keyGroup)) {
        LIM.INPUT.keyGroup[key].count = -1 * LIM.INPUT.waitTime;
    }
};

