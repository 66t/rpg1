/** 系统存储模块
 */
var LIM=LIM||{};
LIM.STORAGE=LIM.STORAGE||{};
((_)=>{
    _.SEED_COUNT=256 //种子数量
    _.SEED_LINK="-" //连接符
    _.KEY_MATRIX=36 //KEY矩阵

    _.Data=function(){this.initialize.apply(this,arguments)}
    _.Data.prototype=Object.create(_.Data.prototype)
    _.Data.prototype.constructor=_.Data
    _.Data.prototype.initialize=function(){
        this.key="";
        this.inn=[];
        this.seed="";
        this.init_seed="";
        this.count_seed="";
        this.initKey()
        this.initSeed()
    };

    /** 初始化随机种子
     * @module storage
     * @method initSeed
     * @example new LIM.STORAGE.Data.initSeed()
     */
    _.Data.prototype.initSeed=function(){
        for(let i=0;i<LIM.STORAGE.SEED_COUNT;i++){
            this.seed+=(i?_.SEED_LINK:"")+LIM.UTILS.radixNum(this.seedNext(Math.randomInt(65535),i),10,36)
            this.count_seed+=(i?_.SEED_LINK:"")+LIM.UTILS.radixNum(0)
        }
        this.init_seed=this.seed
    }

    /** 初始化存档序列
     * @module storage
     * @method initKey
     * @example new LIM.storage.initKey()
     */
    _.Data.prototype.initKey=function(){
        for(let i=0;i< _.KEY_MATRIX* _.KEY_MATRIX;i++) 
            this.key+=LIM.UTILS.radixNum(Math.randomInt( _.KEY_MATRIX),10, _.KEY_MATRIX)
    }


    /** 获取内存秘钥
     * @module storage
     * @method getKey
     * @example new LIM.STORAGE.Data.getKey(40)
     * @param location {int} 数据地址
     * @return {Array} 秘钥 [key1,key2]
     */
    _.Data.prototype.getKey=function (location){
        let x=location%_.KEY_MATRIX
        let y=parseInt(location/_.KEY_MATRIX)%_.KEY_MATRIX
        let t1=[(y)*_.KEY_MATRIX+(x)%6,(y)*_.KEY_MATRIX+(x+1)%6,(y)*_.KEY_MATRIX+(x+2)%6,(y)*_.KEY_MATRIX+(x+3)%6,(y)*_.KEY_MATRIX+(x+4)%6,(y)*_.KEY_MATRIX+(x+5)%6,
            (y+1)*_.KEY_MATRIX+(x)%6,(y+1)*_.KEY_MATRIX+(x+1)%6,(y+1)*_.KEY_MATRIX+(x+2)%6,(y+1)*_.KEY_MATRIX+(x+3)%6,(y+1)*_.KEY_MATRIX+(x+4)%6,(y+1)*_.KEY_MATRIX+(x+5)%6,
            (y+2)*_.KEY_MATRIX+(x)%6,(y+2)*_.KEY_MATRIX+(x+1)%6,(y+2)*_.KEY_MATRIX+(x+2)%6,(y+2)*_.KEY_MATRIX+(x+3)%6,(y+2)*_.KEY_MATRIX+(x+4)%6,(y+2)*_.KEY_MATRIX+(x+5)%6,
            (y+3)*_.KEY_MATRIX+(x)%6,(y+3)*_.KEY_MATRIX+(x+1)%6,(y+3)*_.KEY_MATRIX+(x+2)%6,(y+3)*_.KEY_MATRIX+(x+3)%6,(y+3)*_.KEY_MATRIX+(x+4)%6,(y+3)*_.KEY_MATRIX+(x+5)%6,
            (y+4)*_.KEY_MATRIX+(x)%6,(y+4)*_.KEY_MATRIX+(x+1)%6,(y+4)*_.KEY_MATRIX+(x+2)%6,(y+4)*_.KEY_MATRIX+(x+3)%6,(y+4)*_.KEY_MATRIX+(x+4)%6,(y+4)*_.KEY_MATRIX+(x+5)%6,
            (y+5)*_.KEY_MATRIX+(x)%6,(y+5)*_.KEY_MATRIX+(x+1)%6,(y+5)*_.KEY_MATRIX+(x+2)%6,(y+5)*_.KEY_MATRIX+(x+3)%6,(y+5)*_.KEY_MATRIX+(x+4)%6,(y+5)*_.KEY_MATRIX+(x+5)%6
        ]
        let t2=[(x)*_.KEY_MATRIX+(y)%6,(x)*_.KEY_MATRIX+(y+1)%6,(x)*_.KEY_MATRIX+(y+2)%6,(x)*_.KEY_MATRIX+(y+3)%6,(x)*_.KEY_MATRIX+(y+4)%6,(x)*_.KEY_MATRIX+(y+5)%6,
            (x+1)*_.KEY_MATRIX+(y)%6,(x+1)*_.KEY_MATRIX+(y+1)%6,(x+1)*_.KEY_MATRIX+(y+2)%6,(x+1)*_.KEY_MATRIX+(y+3)%6,(x+1)*_.KEY_MATRIX+(y+4)%6,(x+1)*_.KEY_MATRIX+(y+5)%6,
            (x+2)*_.KEY_MATRIX+(y)%6,(x+2)*_.KEY_MATRIX+(y+1)%6,(x+2)*_.KEY_MATRIX+(y+2)%6,(x+2)*_.KEY_MATRIX+(y+3)%6,(x+2)*_.KEY_MATRIX+(y+4)%6,(x+2)*_.KEY_MATRIX+(y+5)%6,
            (x+3)*_.KEY_MATRIX+(y)%6,(x+3)*_.KEY_MATRIX+(y+1)%6,(x+3)*_.KEY_MATRIX+(y+2)%6,(x+3)*_.KEY_MATRIX+(y+3)%6,(x+3)*_.KEY_MATRIX+(y+4)%6,(x+3)*_.KEY_MATRIX+(y+5)%6,
            (x+4)*_.KEY_MATRIX+(y)%6,(x+4)*_.KEY_MATRIX+(y+1)%6,(x+4)*_.KEY_MATRIX+(y+2)%6,(x+4)*_.KEY_MATRIX+(y+3)%6,(x+4)*_.KEY_MATRIX+(y+4)%6,(x+4)*_.KEY_MATRIX+(y+5)%6,
            (x+5)*_.KEY_MATRIX+(y)%6,(x+5)*_.KEY_MATRIX+(y+1)%6,(x+5)*_.KEY_MATRIX+(y+2)%6,(x+5)*_.KEY_MATRIX+(y+3)%6,(x+5)*_.KEY_MATRIX+(y+4)%6,(x+5)*_.KEY_MATRIX+(y+5)%6
        ]
        for(let i=0;i<t1.length;i++) t1[i]=parseInt(LIM.UTILS.radixNum(this.key[t1[i]],_.KEY_MATRIX,10))
        for(let i=0;i<t2.length;i++) t2[i]=parseInt(LIM.UTILS.radixNum(this.key[t2[i]],_.KEY_MATRIX,10))
        return [
            (t1[0]*t1[11]*t1[16]*t1[21]*t1[26]*t1[31]+
                t1[1]*t1[6]*t1[17]*t1[22]*t1[27]*t1[32]+
                t1[2]*t1[7]*t1[12]*t1[23]*t1[28]*t1[33]+
                t1[3]*t1[8]*t1[13]*t1[18]*t1[29]*t1[34]+
                t1[4]*t1[9]*t1[14]*t1[19]*t1[24]*t1[35]+
                t1[5]*t1[10]*t1[15]*t1[20]*t1[25]*t1[30])-
            (t1[0]*t1[7]*t1[14]*t1[21]*t1[28]*t1[35]+
                t1[1]*t1[8]*t1[15]*t1[22]*t1[29]*t1[30]+
                t1[2]*t1[9]*t1[16]*t1[23]*t1[24]*t1[31]+
                t1[3]*t1[10]*t1[17]*t1[18]*t1[25]*t1[32]+
                t1[4]*t1[11]*t1[12]*t1[19]*t1[26]*t1[33]+
                t1[5]*t1[6]*t1[13]*t1[20]*t1[27]*t1[34])
            ,
            (t2[0]*t2[11]*t2[16]*t2[21]*t2[26]*t2[31]+
                t2[1]*t2[6]*t2[17]*t2[22]*t2[27]*t2[32]+
                t2[2]*t2[7]*t2[12]*t2[23]*t2[28]*t2[33]+
                t2[3]*t2[8]*t2[13]*t2[18]*t2[29]*t2[34]+
                t2[4]*t2[9]*t2[14]*t2[19]*t2[24]*t2[35]+
                t2[5]*t2[10]*t2[15]*t2[20]*t2[25]*t2[30])-
            (t2[0]*t2[7]*t2[14]*t2[21]*t2[28]*t2[35]+
                t2[1]*t2[8]*t2[15]*t2[22]*t2[29]*t2[30]+
                t2[2]*t2[9]*t2[16]*t2[23]*t2[24]*t2[31]+
                t2[3]*t2[10]*t2[17]*t2[18]*t2[25]*t2[32]+
                t2[4]*t2[11]*t2[12]*t2[19]*t2[26]*t2[33]+
                t2[5]*t2[6]*t2[13]*t2[20]*t2[27]*t2[34])
        ]
    }
    
    /** 加密值
     * @module storage
     * @method keyNumber
     * @example new LIM.STORAGE.Data.keyNumber(40,10)
     * @param location {int} 数据地址
     * @param val {int} 加密值
     * @return {string} 加密结果 36进制
     */
    _.Data.prototype.keyNumber=function (location,val){
        let arr=this.getKey(location)
        return LIM.UTILS.radixNum((val-arr[1]*-2)*(arr[0]+3),10,36)
    }
    
    /** 解密值
     * @module storage
     * @method valueNumber
     * @example new LIM.STORAGE.Data.valueNumber(40,"aa")
     * @param location {int} 数据地址
     * @param val {int} 加密值
     * @return {string} 解密结果
     */
    _.Data.prototype.valueNumber=function (location,val){
        let arr=this.getKey(location)
        return Math.round((LIM.UTILS.radixNum(val,36,10)/(arr[0]+3))-arr[1]*2)
    }


    /** 获取内存值
     * @module storage
     * @method getInn
     * @example new LIM.STORAGE.Data.getInn(40)
     * @param location {int} 数据地址
     * @return {string} 内存值
     */
    _.Data.prototype.getInn=function (location){
        let x=location% _.KEY_MATRIX
        let y=parseInt(location/_.KEY_MATRIX)
        if(!this.inn[y]) this.inn[y]=[]
        if(!this.inn[y][x]) this.inn[y][x]=this.keyNumber(location,0)

        return this.valueNumber(location,this.inn[y][x])
    }
    /** 设置内存值
     * @module storage
     * @method setInn
     * @example new LIM.STORAGE.Data.setInn(40,10)
     * @param location {int} 数据地址
     * @return {string} 内存值
     */
    _.Data.prototype.setInn=function (location,val){
        let x=location% _.KEY_MATRIX
        let y=parseInt(location/_.KEY_MATRIX)
        if(!this.inn[y]) this.inn[y]=[]
        this.inn[y][x]=this.keyNumber(location,val)
    }

    /** 获得一个空址
     * @module storage
     * @method idleInn
     * @example new LIM.STORAGE.Data.idleInn()
     * @return {int} 随机数
     */
    _.Data.prototype.idleInn=function () {
        let c=0
        for(let item of this.inn){
            for (let i=0;i<_.KEY_MATRIX;i++) if(!this.inn[c][i]) return c*_.KEY_MATRIX+i
            c++
        }
        return c*_.KEY_MATRIX
    }

    
    /** 根据随机种子获取概率
     * @module storage
     * @method pro
     * @example LIM.storage.pro(10,100)
     * @param mode {int} 使用随机种子
     * @param promax {int} 随机数边界
     * @return {int} 随机数
     */
    _.Data.prototype.pro=function(mode,promax){return this.getSeed(mode)%(promax||100)}
    _.Data.prototype.getSeed=function(mode){
        let seed_arr=this.seed.split(_.SEED_LINK)
        let seed_count=this.count_seed.split(_.SEED_LINK)
        let seed=this.seedNext(LIM.UTILS.radixNum(seed_arr[mode%LIM.STORAGE.SEED_COUNT],36,10),mode%LIM.STORAGE.SEED_COUNT)
        seed_arr[mode%LIM.STORAGE.SEED_COUNT]=LIM.UTILS.radixNum(seed,10,36)
        seed_count[mode%LIM.STORAGE.SEED_COUNT]=LIM.UTILS.radixNum(LIM.UTILS.radixNum(seed_count[mode%LIM.STORAGE.SEED_COUNT],36,10)+1,10,36)
        this.count_seed=seed_count.join(_.SEED_LINK)
        this.seed=seed_arr.join(_.SEED_LINK)
        return seed
    }

    _.Data.prototype.seedNext=function(seed,mode){
        switch(mode%4){
            case 0:seed=(seed*3877+139968)%29573;break//;
            case 1:seed=(seed*421+259200)%54773;break//;
            case 2:seed=(seed*9301+49297)%233280;break//;
            case 3:seed=(seed*281+134456)%28411;break//;
        }
        return Math.round(seed)
    }
})(LIM.STORAGE);