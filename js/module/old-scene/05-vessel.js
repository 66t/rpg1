/*LIM.SCENE.Vessel - RPG Maker MV容器处理对象
作者：LIM

这是一个用来处理容器类的对象，类似于RPG Maker MV中的Window_Base对象。
该对象继承自Sprite对象，并实现了一些额外的功能，如容器的属性维护和运动效果。

包含的方法和功能：

initialize - 对象的初始化方法。
shiftMode - 切换容器的运动模式，并根据预设数据保存相应的属性。
update - 容器的更新方法。
location - 根据预设数据定位容器的位置和属性。
move - 移动容器的位置和属性，并执行相应的事件。
refresh - 刷新容器的属性和运动状态。*/
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_){
    _.Vessel=function(){this.initialize.apply(this,arguments)}
    _.Vessel.prototype = Object.create(Sprite.prototype)
    _.Vessel.prototype.constructor = _.Vessel;

    /**
     * @description Vessel类的初始化方法
     * @param {object} origin - 调用该对象的对象
     * @param {object} com - 元素的配置对象
     * @return {undefined}
     * @function initialize
     * @memberOf _.Vessel
     * @method
     *
     * @description 作用：初始化Vessel对象
     * @description 运行逻辑：
     *   1. 将数据初始化为默认值
     *   2. 设置元素的配置对象和调用该对象的对象
     *   3. 调用Sprite类的初始化方法
     */
    _.Vessel.prototype.initialize = function (origin,com) {
        this._dar=[]
        this._mode=-1
        this._data={}
        this._com=com
        this._origin=origin
        Sprite.prototype.initialize.call(this);//;
    }


    /**
     * @description shiftMode方法
     * @param {undefined}
     * @return {undefined}
     * @function shiftMode
     * @memberOf _.Vessel
     * @method
     *
     * @description 作用：更改容器的显示模式并添加动画数据
     * @description 运行逻辑：
     *   1. 将当前模式与新模式组合成字符串作为事件处理的键名
     *   2. 将新模式赋值给容器的当前模式
     *   3. 将当前模式下的数据结构赋值给容器的_data属性
     *   4. 如果该模式有对应的动画数据，则创建动画数据对象并添加到容器的动画数组中
     *   5. 如果动画数据存在，则将该元素的_com.index设为动画数据中的index属性
     *   6. 将当前容器对象的_run属性乘以3，表示需要重新定位和刷新元素
     *   7. 根据元素属性的变化情况，将需要动画过渡的属性添加到动画数据对象的data属性中
     *   8. 将动画数据对象添加到容器的动画数组中
     */
    _.Vessel.prototype.shiftMode=function(){
        let fun=this._mode+"_"+this._com.mode
        this._mode=this._com.mode
        this._data=this._com.data[this._mode]
        if(this._com.action[fun]){
            let v=this._com.action[fun]
            this._com.index=v.index
            if(this._origin._run%3!=0) this._origin._run*=3
            let data={}
            if(this.x!==this._data.x) data.x=[this.x,this._data.x]
            if(this.y!==this._data.y) data.y=[this.y,this._data.y]
            if(this.alpha!==this._data.alpha) data.alpha=[this.alpha,this._data.alpha]
            this._dar.push({data:data,time:0,frame:v.frame,wave:v.wave,fun:v.fun})
        }
        else this._com.run*=2
    }

    /**
     * @description 更新方法
     * @param {undefined} 无参数
     * @return {undefined} 无返回值
     * @memberOf _.Vessel
     * @method
     *
     * @description 作用：更新场景容器中的元素状态
     * @description 运行逻辑：
     *   1. 调用Sprite类的update方法，更新场景容器的基本状态
     *   2. 如果_com.run大于0，则调用refresh方法更新容器中元素的状态
     *   3. 将_com.run设为1，表示已更新
     */
    _.Vessel.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if(this._com.run>0) {
            this.refresh()
            this._com.run = 1
        }
    }

    /**
     * @description 定位方法
     * @function location
     * @memberOf _.Vessel
     * @method
     *
     * @description 作用：根据容器类的_data属性中的位置信息，定位容器类
     * @description 运行逻辑：
     *   1. 如果容器类的_com.run属性模3等于0，说明需要重新定位，将_com.run属性除以3
     *   2. 根据容器类的_data属性中的位置信息，分别设置容器类的x、y、alpha属性
     * @returns {undefined}
     */
    _.Vessel.prototype.location=function(){
        if(this._com.run%3===0) this._com.run/=3
        this.x=LIM.UTILS.lengthNum(this._data.x)
        this.y=LIM.UTILS.lengthNum(this._data.y)
        this.alpha=LIM.UTILS.lengthNum(this._data.alpha)
    }

    /**
     * @description Vessel对象的移动方法
     * @return {undefined}
     * @memberOf _.Vessel
     * @method
     *
     * @description 作用：根据动画数据实现元素的移动效果
     * @description 运行逻辑：
     *   1. 判断动画时间是否大于0，若是，根据动画数据计算当前位置并更新元素位置和透明度
     *   2. 若动画时间小于总帧数，则增加动画时间，否则执行动画结束后的回调函数并移除动画数据
     */
    _.Vessel.prototype.move=function(){
        if(this._dar[0].time>0) {
            let r=LIM.UTILS.waveNum(this._dar[0].wave,this._dar[0].frame,this._dar[0].time)
            for (let key of Object.keys(this._dar[0].data)) {
                let v=parseFloat(r * (this._dar[0].data[key][1] - this._dar[0].data[key][0]) + this._dar[0].data[key][0])
                switch (key) {
                    case "x":this.x=v;break
                    case "y":this.y=v;break
                    case "alpha":this.alpha=v;break
                }
            }
        }
        if(this._dar[0].time<this._dar[0].frame) this._dar[0].time++
        else {
            this._origin.triggerFun(this._dar[0].fun)
            this._dar.splice(0,1)
        }
    }


    /**
     * @description refresh方法
     * @return {undefined}
     * @memberOf _.Vessel
     * @method
     *
     * @description 作用：刷新容器状态
     * @description 运行逻辑：
     *   1. 如果当前模式与_com.mode不一致，调用shiftMode方法进行切换
     *   2. 如果_com.run是3的倍数，调用location方法定位元素
     *   3. 如果_dar数组长度大于0，调用move方法执行动画效果
     */
    _.Vessel.prototype.refresh=function () {
        if(this._mode!==this._com.mode) this.shiftMode()
        if(this._com.run%3===0) this.location()
        if(this._dar.length>0) this.move()
    }
})(LIM.SCENE);