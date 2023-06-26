var LIM=LIM||{};
LIM.STORAGE=LIM.STORAGE||{};
((_)=>{
   
    _.MAX_Number=999999999 //最大数值
    _.MIN_Number=-999999999 //最小数值
    _.Number=function(){this.initialize.apply(this,arguments)}
    _.Number.prototype=Object.create(_.Number.prototype)
    _.Number.prototype.constructor=_.Number
    _.Number.prototype.initialize=function(){this.arr=[]};
    
    /** 获取数值
     * @module storage
     * @method get
     * @example new LIM.STORAGE.Number.get(1)
     * @param id {int} 数值索引
     */
    _.Number.prototype.get=function(id){
        if(this.arr[id]!=null){
            return LIM.$data.getInn(this.arr[id])
        }
        else return 0
    }
    /** 设置数值
     * @module storage
     * @method set
     * @example new LIM.STORAGE.Number.set(1,1000)
     * @param id {int} 数值索引
     * @param number {int} 设置数值
     */
    _.Number.prototype.set=function(id,number){
        if(this.arr[id]==null) this.arr[id]=LIM.$data.idleInn()
        LIM.$data.setInn(this.arr[id],number.clamp(_.MIN_Number,_.MAX_Number))
    }
})(LIM.STORAGE);

