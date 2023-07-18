var LIM=LIM||{};
LIM.UTILS=LIM.UTILS||{};
((_)=>{
    
    /** 2-36进制转换
     * @module utils
     * @method radixNum
     * @example LIM.UTILS.radixNum(100,10,8)
     * @param num {String|int} 输入数值 
     * @param m {int} 当前进制
     * @param n {int} 转换进制
     * @return {String} 进制转换结果
     */
    _.radixNum = function (num, m, n) {
        num=typeof(num)==='string' ?num:String(num)
        const _DEFAULT_={initNum:10}
        m=m===0?_DEFAULT_.initNum:m
        n=n===0?_DEFAULT_.initNum:n
        n=m&&!n?_DEFAULT_.initNum:n;
        return parseInt(num,m).toString(n)
    }
    
    /** rgba转换16位颜色
     * @module utils
     * @method rpgaReduce
     * @example LIM.UTILS.rpgaReduce(255,255,255,255)
     * @param r {int} 红色
     * @param g {int} 绿色
     * @param b {int} 蓝色
     * @param a {int} 透明度
     * @return {String} 进制转换结果
     */
    _.rpgaReduce=function(r,g,b,a){
        return _.radixNum(Math.min(r||255,255),10,16)+
               _.radixNum(Math.min(g||255,255),10,16)+
               _.radixNum(Math.min(b||255,255),10,16)+
               _.radixNum(Math.min(a||255,255),10,16)
    }
    
    /** 获得当前时间戳
     * @module utils
     * @method getTimestamp
     * @example LIM.UTILS.getTimestamp()
     * @return {int} 时间戳 
     */
    _.getTimestamp = function() {return new Date().getTime();};
    
    /** 获得正态分布随机数
     * @module utils
     * @method getNormalRadom
     * @example LIM.UTILS.getNormalRadom(160,20,25,1,2)
     * @param base {int} 基准值
     * @param d {int} 下限值
     * @param b {int} 上限值
     * @param sd {int} 向下偏移幅度 
     * @param sb {int} 向上偏移幅度
     * @return {int} 随机数
     */
    _.getNormalRadom=function(base,d,b,sd,sb){
        base++;d+=2
        let t=_.normalRadom()
        let num=parseInt(base + t*(t>0?(sd*5*d)/d:(sb?(sb*5*b):(sd*5*b))/b)).clamp(base-d,base+b)
        return (num<=base-d||num>=base+b)?_.getNormalRadom(base-1,d-2,b,sd,sb):num
    }
    _.normalRadom=function () {
        let u=0.0,v=0.0,w=0.0,c=0.0
        do{
            u=Math.random()*2-1
            v=Math.random()*2-1
            w=u*u+v*v
        } while (w==0||w>1)
        c=Math.sqrt((-2*Math.log(w))/w)
        return u*c;
    }
    
    /** 验证数字
     * @module utils
     * @method isNum
     * @example LIM.UTILS.isNum(255)
     * @param num {any} 验证值
     * @return {boolean} 是数字(true) 不是数字(false)
     */
    _.isNum=function(num){return (num!=null&&num!=''&&!isNaN(num))}

    
    /** 获取二进制位
     * @module utils
     * @method isNum
     * @example LIM.UTILS.atBit(4,1)
     * @param num {int} 输入值
     * @param bit {int} 位数 从0开始
     * @return {int} 结果
     */
    _.atBit=function(num,bit){return num>>bit&1}
    _.setBit=function(num,bit,bool) {
        if (bool) return num | (1 << bit);
        else return num & ~(1 << bit);
    }

    
    /** 计算正弦
     * @module utils
     * @method sinNum
     * @example LIM.UTILS.sinNum(4,1)
     * @param max {int} 周期(由0到1)
     * @param i {int} 当前值
     * @return {int} 结果
     */
    _.sinNum=function(max,i){return Math.sin(Math.PI/2/max*i).toFixed(7)}


    _.waveNum=function(mode,max,i,f,r) {
        if(mode%5==0) i*=2
        let p=parseInt(i/(max/(1/f)))%2===1?-1:1
        let o=parseInt(i/(max/(1/f)))%4%2===1?-1:1
        let q=i%(max/f)
        let value=0;
        switch (mode) {
            //弦
            case 104://方波 
                value=(Math.sin((Math.PI * 2 / max * q)) >= 0 ? 1 : -1)*
                    (Math.sin((Math.PI * 2 / (max/2) * q)) >= 0 ? 0 : 1)
                break;
            case 204://三角波
                value = (2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q));
                break;
            case 304://正弦波
                value = Math.sin((Math.PI * 2 / max* q));break
            case 404://平滑波
                value=Math.floor((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q))*10+0.5)/10;
                break;

            case 105: //半圆波  
                value=  Math.sqrt(1 - Math.pow(((q%max)*2/max-1),4))*p;break
            case 205: //方根波
                value = Math.sqrt(Math.abs(Math.sin((Math.PI/max*q))))*p;break;
            case 305: //方根波 
                let s = Math.E;
                value=(1-((q/max-1)*(q/max) * ((s+1)*(q/max)+s)+1))*p;break
            case 405: //弹跳波
                value= Math.exp(-Math.pow(q*2 - max,2) / (2 * Math.pow(max / 6, 2)))
                value=p>0?value:1-value
                value=o>0?value:(1-value)*-1;
                break
            case 505: //平方三角
                value =  Math.pow((2 / Math.PI) * Math.asin(Math.sin((2 * Math.PI / max) * q)),2)*p;break
            case 605: //平方正弦
                value = Math.pow(Math.sin((Math.PI * 2 / max* q)),2)*p;break
            case 705: //斐波那契 //
                let angle = 0.5 * Math.sqrt(p>0?q:max-q);
                let radius = Math.sqrt(q/ max);
                let x1 = radius * Math.cos(angle);
                let y1 = radius * Math.sin(angle);
                value=(Math.abs(x1)+Math.abs(y1))*p
                break


            //随机
            case 101: //振荡
                value= Math.sin(q);break
            case 201: //振荡余弦
                value= Math.cos(q)*Math.sin(q);break
            case 301: //振荡正切
                value= Math.tan(q);break
            case 401: //平均振荡
                value= (Math.sin(q) + Math.cos(q)) / 2;break


            //过渡
            case 102: //指数
                value = 1-Math.pow(1.03,-q)
                break
            case 202: //反比例
                value = 1 /(q+100)*q
                break
            case 302:  //弦反比例
                value = (0.14/(Math.abs(Math.sin((Math.PI * 2 / max* (max-q)/4)))+0.14))
                break
            case 402:  //方根
                value= Math.sqrt(q/max);break
            case 502:  //平方
                value= Math.pow(q/max,2);break
            case 602:  //正态
                value= Math.exp(-Math.pow(q*1 - max,2) / (2 * Math.pow(max / 6, 2)));break
            case 702:  //弹性
                value=  Math.pow(2, -10 * q / max) * Math.sin((q / max - 0.1) * (2 * Math.PI) / 0.4) + 1;break
            case 802:  //贝塞尔
                value= 3 * (q/max) * Math.pow(1 -  (q/max) , 2) + 3 * Math.pow( (q/max) , 2) * (1 -  (q/max) ) + Math.pow( (q/max) , 3);break
            case 902:  //阻尼振荡
                let f = 0.3;
                let s1 = f / 4;
                value=  Math.pow( 2, -10 *  (q/max)) * Math.sin(( (q/max) - s1) * (2 * Math.PI)) + 1;
        }
        return value*(r?-1:1);
    }
    _.waveArr=function (val,time,data) {
        for(let v of data){
            let r = _.waveNum(v.wave, (v.frame||time[0]),time[1]+(parseInt(v.phase)),v.freq,v.reve)/v.sample;
            let num = _.lengthNum(v.val1) + (_.lengthNum(v.val2) - _.lengthNum(v.val1)) * r;
            if(v.digit) num=Math.round(num)
            switch (v.count) {
                case "add":
                    val += num;
                    break;
                case "mul":
                    val *= num;
                    break;
                case "and":
                    val = val&num;
                    break;
                case "or":
                    val = val|num;
                    break;
                case "xor":
                    val = val^num;
                    break;
                case "max":
                    val = Math.max(val,num);
                    break;
                case "min":
                    val = Math.min(val,num);
                    break;
                case "pow":
                    val=Math.pow(val,num)
                    break
            }
        }
        return val
    }
    
    _.countWave=function (wave,time,param){
        let result = {};
        for (let key in  wave) {
            let data=wave[key]
            let val=0
            if(data.cor){
                switch (data.type){
                    case "seed":val=Math.random();break
                    case "add": val=param[key]+data.val;break
                }
            }
            else if (typeof wave[key] == "object") val+=_.waveArr(val,time,data)
            else val = LIM.UTILS.lengthNum(wave[key]);     
            result[key]=val
        }
        return result
    }

    /** 求a开b次方的方根
     * @module utils
     * @method rooting
     * @example LIM.UTILS.rooting(99,3)
     * @param a {number} 指定数a
     * @param b {number} 开b方
     * @return {number} 方根
     */
    _.rooting=function(a,b){return Math.abs(a)**(1/b)}

    /** 求以a为底b的对数
     * @module utils
     * @method bottnum
     * @example LIM.UTILS.bottnum(99,3)
     * @param a {number} 底数a
     * @param b {number} 真数b
     * @return {number} 对数
     */
    _.bottnum=function(a,b){return Math.log(a)/Math.log(b)}
   
    /** 平面方向角计算
     * @module utils
     * @method azimuth
     * @example LIM.UTILS.azimuth([5,5],30,10)
     * @param dual {Object} 坐标{x,y}
     * @param angle {number} 角度
     * @return {Object} 极坐标 {x,y}
     */
    _.azimuth=function (dual,angle,d) {return {x:dual.x+d*Math.cos(angle),y:dual.y+d*Math.sin(angle)}}
    
    /** 返回质数组
     * @module utils
     * @method angelPrime
     * @example LIM.UTILS.angelPrime(50)
     * @param num {number} 位数
     * @return {Array} 质数数组
     */
    _.angelPrime=function(num){
        let arr=[2,3],i=5
        while (arr.length<num) {
            for(let num of arr)
                if(num**2>i) {arr.push(i);break}
                else if(i%num==0) break;
            i+=(i%6==5?2:4)
        }
        return arr
    }
    
    /** 返回a b的最大公约数
     * @module utils
     * @method commonDiv
     * @example LIM.UTILS.commonDiv(50,75)
     * @param a {int} 第一个数
     * @param b {int} 第二个数
     * @return {int} 最大公约数
     */
    _.commonDiv=function (a,b) {
        if(b==0)return a
        return _.commonDiv(b,a%b)
    }

    /** 返回a b的最小公倍数
     * @module utils
     * @method commonMul
     * @example LIM.UTILS.commonMul(8,42)
     * @param a {int} 第一个数
     * @param b {int} 第二个数
     * @return {int} 最小公倍数
     */
    _.commonMul=function (a,b) {
        return a*b/_.commonDiv(a,b)
    }

    /** 将分子 分母简化
     * @module utils
     * @method fractionOth
     * @example LIM.UTILS.fractionOth(815,4200)
     * @param son {int} 分子
     * @param mum {int} 分母
     * @return {Array} 分子式[son,mun]
     */
    _.fractionOth=function (son,mum) {
        let div=100
        while (div>1){
            div=_.commonDiv(son,mum)
            son/=div;mum/=div
        }
        return [son,mum]
    }
    
    /** 将一个小数部分写为分子式
     * @module utils
     * @method fractionExp
     * @example LIM.UTILS.fractionExp(2.5)
     * @param son {number} 小数
     * @return {Array} 分子式[son,mun]
     */
    _.fractionExp=function (num) {
        return _.fractionOth(num,Math.pow(10,num.toString().length))
    }
    
    /**获得百分比*/
    _.lengthNum=function(num){
        try {
            if(isNaN(num))
            {
                if(num.split("w").length>1) {
                    let arr = num.split("w")
                    let a = parseFloat(arr[0]) * 0.01 * Graphics.width
                    let b = arr[1] ? parseFloat(arr[1]) : 0
                    return a + b
                }
                else if(num.split("h").length>1) {
                    let arr = num.split("h")
                    let a = parseFloat(arr[0]) * 0.01 * Graphics.height
                    let b = arr[1] ? parseFloat(arr[1]) : 0
                    return a + b
                }
                else return 0
            }
            else return parseFloat(num)
        }
        catch (e) {
            return 0
        }
    }
})(LIM.UTILS);
