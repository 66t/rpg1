/*LIM.SCENE.Main - RPG Maker MV场景处理对象
作者：LIM

这是一个用来处理游戏场景的对象，类似于RPG Maker MV中的Scene_Base对象。
该对象采用了一种类似于模块化的方式，将各种处理逻辑分成了不同的函数和方法。
通过将数据结构放在this._data中，可以更方便地管理和访问场景中的各种元素，
比如窗口、装饰、命令等等。

包含的方法和功能：
 initialize - 对象的初始化方法。
 createItem - 根据数据结构创建场景中的元素。
 showItem - 根据元素的层级，将它们添加到场景中并显示出来。
 update - 场景的更新方法。
 changer - 处理布尔值。
 triggerFun - 执行事件。
 exFun - 执行事件的具体实现方法。
 getBit - 根据键名获取位图对象。
 reserve - 预加载图像资源。*/
var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};
(function(_) {

    _.Main=function(){this.initialize.apply(this,arguments)}

    _.Main.prototype = Object.create(Scene_Base.prototype);
    _.Main.prototype.constructor = _.Main;


    /**
     * @description 初始化Main对象
     * @param {object} _ - Main对象
     * @return {undefined}
     * @function initialize
     * @memberOf _.Main
     * @method
     *
     * @description 作用：初始化Main对象，设定时间和数据结构，并预加载图像资源
     * @description 运行逻辑：
     *   1. 设定时间变量为0
     *   2. 设定一个控制createItem和showItem的调用频率的变量_run，初始值为2*3*5
     *   3. 如果没有数据结构，则将数据结构设为空对象
     *   4. 调用父类Scene_Base的initialize方法
     *   5. 预加载图像资源
     */
    _.Main.prototype.initialize = function () {
        this._time = 0;
        this._run=2*3*5;
        this._data=this._data||{};
        Scene_Base.prototype.initialize.call(this);
        this.reserve();
    }

    /**
     * @description 更新Main对象
     * @param {undefined}
     * @return {undefined}
     * @function update
     * @memberOf _.Main
     * @method
     *
     * @description 作用：更新Main对象
     * @description 运行逻辑：
     *   1. 时间变量加1
     *   2. 如果_run可以整除5，则调用createItem方法创建元素
     *   3. 如果_run可以整除3，则调用showItem方法按照层级显示元素
     *   4. 如果_run可以整除2，则遍历所有子元素并调用其update方法更新
     *   5. 调用changer方法检查布尔变量是否需要更新
     */
    _.Main.prototype.update = function () {
        this._time++
        if(this._run%5==0)
            this.createItem()
        if(this._run%3==0)
            this.showItem()
        if(this._run%2==0)
            for(let item of this.children) item.update()
        this.changer()
    }

    /**
     * @description 创建项目
     * @param {undefined}
     * @return {undefined}
     * @function createItem
     * @memberOf _.Main
     * @method
     *
     * @description 作用：根据数据结构创建各种元素，并存储在this._item对象中
     * @description 运行逻辑：
     *   1. 如果_run能够被5整除，则将_run除以5，控制createItem的调用频率
     *   2. 清空元素对象
     *   3. 根据数据结构创建各种元素
     *   4. 对容器、窗口、命令、装饰等元素进行不同的创建方式
     *   5. 将创建的元素存储在this._item对象中
     */
    _.Main.prototype.createItem = function () {
        if(this._run%5===0) this._run/=5
        this._item = {}

        if(this._data.vessel)
            for(let key of Object.keys(this._data.vessel))
            {
                let item = this._data.vessel[key]
                this._item[key]=new LIM.SCENE.Vessel(this,item)
            }
        if(this._data.window)
            for(let key of Object.keys(this._data.window))
            {
                let item = this._data.window[key]
                this._item[key]=new LIM.SCENE.Window(this,item)
            }
        if(this._data.commcad)
            for(let key of Object.keys(this._data.commcad))
            {
                let item = this._data.commcad[key]
                this._item[key]=new LIM.SCENE.Commcad(this,item)
            }
        if(this._data.adorn)
            for(let key of Object.keys(this._data.adorn))
            {
                let item = this._data.adorn[key]
                switch (item.type) {
                    case "shape":
                        this._item[key]=new LIM.SCENE.Shape(this,item)
                        break
                }
            }
    };
    /**
     * @description 根据项目层级显示元素
     * @return {undefined}
     * @function showItem
     * @memberOf _.Main
     * @method
     *
     * @description 作用：根据元素的层级顺序将元素显示在页面上
     * @description 运行逻辑：
     *   1. 如果_run可以被3整除，则将_run除以3，以控制showItem的调用频率
     *   2. 清空子元素列表
     *   3. 定义一个空数组arr，将vessel、window、commcad和adorn元素按照层级排序，存入arr
     *   4. 对数组arr按照层级降序排列
     *   5. 遍历arr数组中的元素，根据元素的类型将元素显示在页面上
     *      1. 如果元素类型是group，则将元素添加到父元素下
     *      2. 如果元素类型不是group，则将元素添加到主元素下
     * @description 算法分析：
     *   - 本方法实现了根据元素层级排序显示元素的功能，具体实现方法如下：
     *     1. 将各种类型的元素按照层级存入数组arr
     *     2. 对数组arr按照元素的index属性进行降序排列
     *     3. 遍历数组arr中的元素，如果元素类型是group，则将元素添加到父元素下；如果不是，则将元素添加到主元素下
     *     4. 在添加元素时，如果父元素下已经有了子元素，则按照index的大小将子元素插入到正确的位置
     */
    _.Main.prototype.showItem=function(){
        if(this._run%3===0) this._run/=3
        this.children=[]
        let arr=[]
        if(this._data.vessel)
            for(let key of Object.keys(this._data.vessel))
                arr.push({key:key,index:this._data.vessel[key].index})
        if(this._data.window)
            for(let key of Object.keys(this._data.window))
                arr.push({key:key,index:this._data.window[key].index})
        if(this._data.commcad)
            for(let key of Object.keys(this._data.commcad))
                arr.push({key:key,index:this._data.commcad[key].index})
        if(this._data.adorn)
            for(let key of Object.keys(this._data.adorn))
                arr.push({key:key,index:this._data.adorn[key].index})
        arr.sort(LIM.UTILS.sortBy("index",false))
        for(let item of arr)
            if(this._item[item.key]) {
                if(this._data.group[item.key]){
                    let pant=this._item[this._data.group[item.key]]
                    let index=this._item[item.key]._com.index
                    if(pant.children.length)
                        for(let i=0;i<pant.children.length;i++){
                            if(pant.children[i]._com) if(index<pant.children[i]._com.index) {pant.addChildAt(this._item[item.key],i);i=pant.children.length}
                            else if(i==pant.children.length-1)pant.addChild(this._item[item.key])
                        }
                    else pant.addChild(this._item[item.key])
                }
                else this.addChild(this._item[item.key])
            }

    }


    /**
     * @description 检查布尔值是否满足条件
     * @return {undefined}
     * @function changer
     * @memberOf _.Main
     * @method
     *
     * @description 作用：检查布尔值是否满足条件，如果满足，则触发事件
     * @description 运行逻辑：
     *   1. 遍历数据结构中的所有布尔值
     *   2. 如果该布尔值等于1并且条件满足，则将布尔值加1，并触发对应的事件
     *   3. 触发事件后，会继续执行其中包含的所有事件
     */
    _.Main.prototype.changer=function(){
        if(this._data.changer)
            for(let item of Object.keys(this._data.changer))
                if (this._data.changer[item].bool === 1&&LIM.EVENT[this._data.changer[item].eval]()) {
                    this._data.changer[item].bool++
                    this.triggerFun(this._data.changer[item].fun)
                }
    }

    /**
     * @description 触发事件
     * @param {Array} eve - 事件数组
     * @return {undefined}
     * @function triggerFun
     * @memberOf _.Main
     * @method
     *
     * @description 作用：触发事件
     * @description 运行逻辑：
     *   1. 遍历事件数组eve中的每个元素item
     *   2. 如果item以"%"开头，则表示调用LIM.EVENT中对应的函数
     *   3. 如果item以"#"开头，则表示调用exFun函数
     *   4. 否则，根据item在数据结构中的位置，递归调用triggerFun函数
     */
    _.Main.prototype.triggerFun=function(eve){
        for(let item of eve) {
            if (item[0] == "%") LIM.EVENT[item.substring(1,item.length)]()
            else if (item[0] == "#") this.exFun(item.split(":"))
            else if (this._data.fun[item]) this.triggerFun(this._data.fun[item])
        }
    }

    /**
     * @description exFun方法
     * @param {array} eve - 事件数组
     * @return {undefined}
     * @function exFun
     * @memberOf _.Main
     * @method
     *
     * @description 作用：执行事件
     * @description 运行逻辑：
     *   1. 根据事件数组第一个元素选择执行操作
     *   2. 如果事件为"#refurbish"，将_run的值乘以3
     *   3. 如果事件为"#item_next"，将对应元素的_com.next设为第三个元素
     *   4. 如果事件为"#item_loop"，将对应元素的_com.loop设为true，并将_com.next设为_com.mode
     *   5. 如果事件为"#item_index"，将对应元素的_com.index设为第三个元素
     *   6. 如果事件为"#item_mode"，将对应元素的_com.mode设为第三个元素
     *   7. 如果事件为"#com_acti"，根据第二个元素设定对应元素的激活状态
     *   8. 如果事件为"#changer_on"，将对应布尔变量的值加1
     *   9. 如果事件为"#changer_off"，将对应布尔变量的值设为0
     */
    _.Main.prototype.exFun=function(eve){
        switch (eve[0]) {
            case "#refurbish":
                this._run*=3
                break
            case "#item_next":
                if(this._item[eve[1]]) this._item[eve[1]]._com.next=eve[2]
                break
            case "#item_loop":
                if(this._item[eve[1]]){
                    this._item[eve[1]]._com.loop=true
                    this._item[eve[1]]._com.next=this._item[eve[1]]._com.mode
                }
                break
            case "#item_index":
                if(this._item[eve[1]]) this._item[eve[1]]._com.index=eve[2]
                break
            case "#item_mode":
                if(this._item[eve[1]]) this._item[eve[1]]._com.mode=eve[2]
                break
            case "#com_acti":
                if(this._item[eve[1]]){
                    if(eve[1]=="0")this._item[eve[1]].activate=false
                    else  this._item[eve[1]].activate=true
                }
                break
            case "#changer_on":
                if(this._data.changer[eve[1]])
                    this._data.changer[eve[1]].bool++
                break
            case "#changer_off":
                if(this._data.changer[eve[1]])
                    this._data.changer[eve[1]].bool=0
                break
        }
    }


    /**
     * @description 获取位图资源
     * @param {string} key - 位图资源的键名
     * @return {object|null} - 返回ImageManager.loadBitmap加载后的位图资源对象，如果位图不存在则返回null
     * @function getBit
     * @memberOf _.Main
     * @method
     *
     * @description 作用：根据传入的位图资源键名获取位图资源，如果资源存在则返回加载后的位图资源对象，否则返回null
     * @description 运行逻辑：
     *   1. 检查数据结构中是否存在传入的位图资源键名
     *   2. 如果存在，则调用ImageManager.loadBitmap加载该位图资源，并返回加载后的位图资源对象
     *   3. 如果不存在，则返回null
     */
    _.Main.prototype.getBit=function (key) {
        if(this._data.bit[key]) return ImageManager.loadBitmap(this._data.bit[key][0], this._data.bit[key][1], this._data.bit[key][2], this._data.bit[key][3])
        else return null
    }

    /**
     * @description 预加载图像资源
     * @param {undefined}
     * @return {undefined}
     * @function reserve
     * @memberOf _.Main
     * @method
     *
     * @description 作用：预加载图像资源
     * @description 运行逻辑：
     *   1. 如果数据结构存在并且包含位图，则遍历位图数组
     *   2. 对于每个位图，调用ImageManager的loadBitmap方法加载图片资源
     */
    _.Main.prototype.reserve = function () {
        if(this._data&&this._data.bit)
            for(let item of Object.keys(this._data.bit)) {
                ImageManager.loadBitmap(this._data.bit[item][0],this._data.bit[item][1],
                    this._data.bit[item][2],this._data.bit[3])
            }
    }
})(LIM.SCENE);





