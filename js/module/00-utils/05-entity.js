//===========================
// @-06-entity
// @Path      js/module/00-utils
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/7/9)
// ©2023 limpid
//===========================
var LIM=LIM||{};
LIM.ENTITY=LIM.ENTITY||{};

LIM.ENTITY.Scene=function(){
    return {
        bit:{},  //位图
        effector:{}, //触发器
        handler:{}, //指令
        sound:{}, //声效
        text:{},  //文本
        filter:{},  //滤镜
        
        group:{}, //组
        vessel:{},  //容器
        window:{},  //窗口 
        command:{}, //命令行 
        shape:{},   //图形
        wave:{},    //波
        fica:{},    //分形
        
        tube:{}    //管道
    }
}
LIM.ENTITY.Vessel=function(){
    return {
        acti:false, //激活
        run:0,      //运行
        ope:0,      //操作
        data:[],    //数据
        action:{},  //动作
    }
}
LIM.ENTITY.Shape=function(){
    return {
        acti:false, //激活
        run:0,      //运行
        loop: true,
        data:[],    //数据
        action:{},  //动作
    }
}
LIM.ENTITY.Command=function(){
    return {
        acti:false, //激活
        run:0,      //运行
        ope:0,      //操作
        data:[],    //数据
        action:{},  //动作
        symbol:{},
        se:{},
        input:{}
    }
}
LIM.ENTITY.SceneFilter=function(){
    return {
        type:"",
        acti:false,
        cease:false,
        cycle:0,
        time:0,
        com:"",
        uniforms:{},
        wave:{}
    }
}

LIM.ENTITY.Text=function(){
    return {
        content:"", //文本
        anime:0,    //动画
        fontSize:20,
        textColor:[],
        outlineColor:[],
        outlineWidth:0,
        fontItalic:false
    }
}
LIM.ENTITY.Sound=function(){
    return {
        traje:0,
        type:"bgm",
        name:"",
        volume:1,
        rate:1,
        time:[0,0],
        "fade":[0,0,"linear","linear"],
        "pan":[0,0],
        "loop":[true,0,0],
        "dis":[0,"none"],
        "bit":[1,0],
        "filter":["none",10,-12,0,0]
    }
}

LIM.ENTITY.ShapeData=function(){
    return {
        index:0,   //层级
        bit:"",    //图源
        cover:0,   //缩放模式
        adso:7,    //定位
        w:0,h:0,x:0,y:0,
        rota:0,alpha:0,
        filter:[],
        clip:[0,0,0,0,0,0,0,0],
        tone:[0,0,0,0],       
        blend:[0,0,0,0]
    }
}
LIM.ENTITY.Effector=function() {
    return {
        count: 1,
        judge:"",
        com:"",
    }
}

