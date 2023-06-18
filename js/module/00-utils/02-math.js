var LIM=LIM||{};
LIM.UTILS=LIM.UTILS||{};
(function(_){
    
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

    /** 计算波
     * @module utils
     * @method waveNum
     * @example LIM.UTILS.sinNum(0,4,1)
     * @param wave {int} 波形
     * @param max {int} 周期(由0到1)
     * @param i {int} 当前值
     * @return {int} 结果
     */
    _.waveNum=function(mode,max,i) {
        i = i % (max*2);
        let t = i / max;
        switch (parseInt(mode)) {
            default: // 方波形
                return t >= 1 ? 1 : 0;
            case 1: // 三角波
                return parseInt(t) % 2 == 1 ? 1 - (t % 1.0) : (t % 1.0);
            case 2: // 正弦波
                return Math.abs(_.sinNum(max, i));
            case 3:
                return Math.abs(_.sinNum(max/2, i));
            case 4: // 斜波
                return t - Math.floor(t)
            case 5: // 指数衰减
                return Math.pow(1.11, -i);
            case 6: // 调幅波
                return 1 / (i + 1.11);
            case 7: // 平方根过渡
                return Math.sqrt(i / max);
            case 8: // 平方过渡
                return Math.pow(i / max, 2);
            case 9: // 高斯函数
                let sigma = max / 6;
                return Math.exp(-Math.pow(i - max, 2) / (2 * Math.pow(sigma, 2)));
            case 10: // 三次贝塞尔曲线过渡
                return 3 * t * Math.pow(1 - t, 2) + 3 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
            case 11: // 弹性过渡
                return Math.pow(2, -10 * i / max) * Math.sin((i / max - 0.1) * (2 * Math.PI) / 0.4) + 1;
            case 12: // 回弹过渡
                let s = 1.70158;
                return ((t = i / max - 1) * t * ((s + 1) * t + s) + 1);
            case 13: // 阻尼振荡过渡
                let p = 0.3;
                let s1 = p / 4;
                return Math.pow( 2, -10 * t) * Math.sin((t - s1) * (2 * Math.PI) / p) + 1;
            case 14: // 心型
                let x = (2 * i - max) / max;
                let y = (2 * Math.pow(x, 2) - 1) * Math.sqrt(1 - Math.pow(x, 2));
                return (y + 1) / 2;
            case 15: // 平滑步进波形
                return Math.floor(t /0.1) * 0.1;
            case 16: // 半圆波
                return Math.sqrt(1 - Math.pow((t - 1), 2));
            case 17: // Sine-Cosine波
                return (Math.sin(i) + Math.cos(i)) / 2;
            case 18: // 反弹过渡
                let s2 = 1.5;
                return 1 - ((t = i / max - 1) * t * ((s2 + 1) * t + s2) + 1);
            case 19: // 径向渐变
                let centerX = max / 2;
                let centerY = max / 2;
                let distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(i - centerY, 2));
                return distance / max;
            case 20: // 曲线过渡
                return Math.sin(i * Math.PI / max);
            case 21://震荡波
                return Math.sin(i) * Math.cos(i);
            case 22: // 斐波那契螺旋
                let angle = 0.5 * Math.sqrt(i);
                let radius = Math.sqrt(i / max);
                let x1 = radius * Math.cos(angle);
                let y1 = radius * Math.sin(angle);
                return (Math.abs(x1) + Math.abs(y1)) / 2;
        }
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
