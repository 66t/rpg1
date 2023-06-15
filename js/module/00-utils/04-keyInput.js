var LIM = LIM || {};
LIM.INPUT = LIM.INPUT || {};
LIM.INPUT.codeTable = {};
LIM.INPUT.key={}
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


LIM.INPUT.registerCode=function (key){
    let codeTable = LIM.INPUT.codeTable[key];
    if (codeTable !== undefined) {
        if (codeTable.upTime > codeTable.keyTime) {
            codeTable.keyTime = Date.now();
            codeTable.count = 0;
        }
    }
    else LIM.INPUT.codeTable[key] = { keyTime: Date.now(), upTime: -1, count: 0 };
}
LIM.INPUT.releaseCode=function (key){
    let codeTable = LIM.INPUT.codeTable[key];
    if (codeTable !== undefined) codeTable.upTime = Date.now();
}


LIM.INPUT.update = function() {
    let time = Date.now();
    for (let key in LIM.INPUT.codeTable) {
        let codeTable = LIM.INPUT.codeTable[key];
        let { count, keyTime, upTime } = codeTable;
        if (count < 0) {
            if (++codeTable.count === 0) {
                delete LIM.INPUT.codeTable[key];
                this.keyEvent(key, -2);//重置时
            }
        } 
        else if (keyTime > upTime) {
            if (codeTable.count%LIM.INPUT.inputTime === 0) {
                this.keyEvent(key, codeTable.count/LIM.INPUT.inputTime);//按下时
            }
            codeTable.count++
        }
        else {
            codeTable.count = ~LIM.INPUT.waitTime;
            this.keyEvent(key, -1);//松开时
        }
    }
    for(let key in LIM.INPUT.controlMapper){
        if(LIM.INPUT.isInput(key)) LIM.INPUT.key[key]=LIM.INPUT.key[key]+1
        else LIM.INPUT.key[key]=-1
    }
};

LIM.INPUT.X=function (key,down){
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
    let codeTable = LIM.INPUT.codeTable[key];
    if (codeTable !== undefined){
        if(codeTable.count>-1) return parseInt(codeTable.count/LIM.INPUT.inputTime)
        else return -1
   }
    else return -2
}

//激活事件
LIM.INPUT.keyEvent=function (key,eve){
    if(LIM.INPUT.keyMapper[key+":"+eve]&&LIM.EVENT[LIM.INPUT.keyMapper[key+":"+eve]])
        LIM.EVENT[LIM.INPUT.keyMapper[key+":"+eve]]()
}

//修改场景管理
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
    LIM.INPUT.registerCode(keyCode)
};
SceneManager.onKeyUp = function({ keyCode }) {
    if (keyCode === 123) return;
    LIM.INPUT.releaseCode(keyCode)
};
SceneManager.onBlur = function() {LIM.INPUT.codeTable={}};

