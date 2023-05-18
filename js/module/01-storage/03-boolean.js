var LIM=LIM||{};
LIM.STORAGE=LIM.STORAGE||{};
(function(_){
    _.Bool=function(){this.initialize.apply(this,arguments)}
    _.Bool.prototype=Object.create(_.Bool.prototype)
    _.Bool.prototype.constructor=_.Bool
    _.Bool.prototype.initialize=function(){this.arr=[]};
    
    /** 获取布尔值
     * @module storage
     * @method get
     * @example new LIM.STORAGE.Bool.get(1)
     * @param id {int} 布尔索引
     */
    _.Bool.prototype.get=function(id){
        let arr=parseInt(id/16)
        if(this.arr[arr]!=null){
            let key=this.getGroup(arr)
            return key[id%16]>1
        }
        else return false
    }
    
    /** 设置布尔值
     * @module storage
     * @method set
     * @example new LIM.STORAGE.Bool.set(1,true)
     * @param id {int} 布尔索引
     * @param bool {boolean} 设置布尔值
     */
    _.Bool.prototype.set=function(id,bool){
        let arr=parseInt(id/16)
        if(this.arr[arr]==null) this.arr[arr]=LIM.$data.idleInn()
        let key=this.getGroup(arr).split("")
        key[id%16]=(bool?2:1)
        key=key.join("")
        LIM.$data.setInn(this.arr[arr],LIM.UTILS.radixNum(parseInt(key),3,10))
    }
    
    /** 获取内存中布尔组
     * @module storage
     * @method getGroup
     * @example new LIM.STORAGE.Bool.getGroup(1)
     * @param index {int} 内存位置
     */
    _.Bool.prototype.getGroup=function(index){
        return LIM.UTILS.radixNum(LIM.$data.getInn(this.arr[index]),10,3).padZero(16)
    }
})(LIM.STORAGE);


