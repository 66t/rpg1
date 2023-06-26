var LIM=LIM||{};
LIM.UTILS=LIM.UTILS||{};
((_)=>{

    /** 打乱数组
     * @module utils
     * @method shuffleArr
     * @example LIM.UTILS.shuffleArr([1,2,3,4,5,6,7],10)
     * @param arr {Array} 操作数组
     * @param seed {int} 非必填 采用的随机种子
     * @return {Array} 进制转换结果
     */
     _.shuffleArr=function (arr,seed) {
         if (!Array.isArray(arr)) { return [] }
         let newArr=new Array()
         while (arr.length) 
             newArr.push(arr.splice(seed&&LIM.$data?LIM.$data.pro(seed,arr.length):Math.randomInt(arr.length),1)[0])
         return newArr
     }


    /** 计数排序（特化用于处理整数数组的排序法）
     * @module utils
     * @method countingSort
     * @example LIM.UTILS.shuffleArr([1,2,3,4,5,6,7])
     * @param arr {Array} 操作数组
     * @return {Array} 排序结果
     */
     _.countingSort=function (arr) {
         if (arr.length <= 1) return arr;
         let min=Math.min(...arr)
         let count=[],result = [],index = 0;
         for (let num of arr) if(!count[num-min]||!count[num-min]++) count[num-min]=1
         for (let i=0;i<count.length; i++) while (count[i]-->0) result[index++]=i+min;
         return result;
}
    /** 快速排序
     * @module utils
     * @method quickSort
     * @example LIM.UTILS.quickSort([1,2,3,4,5,6,7])
     * @param arr {Array} 操作数组
     * @return {Array} 排序结果
     */
     _.quickSort=function(arr) {
         if (arr.length <= 1) return arr;
         let pivotIndex = Math.floor(arr.length / 2);
         let pivot = arr.splice(pivotIndex, 1)[0];
         let left = [],right = [];
         for (let i = 0; i < arr.length; i++)
             if (arr[i] < pivot) left.push(arr[i]);
             else right.push(arr[i]);
         return _.quickSort(left).concat([pivot], _.quickSort(right));
     }
    /** 定义并填充一个数组
     * @module utils
     * @method fillArray
     * @example LIM.UTILS.fillArray(5,0)
     * @param num {int} 数组大小
     * @param item {Object} 填充项目
     * @return {Array} 填充数组
     */
     _.fillArray=function(num,item){return new Array(num).fill(item)}
     
    /** 得到两个数组的并集
     * @module utils
     * @method union
     * @example LIM.UTILS.union([1,1,3,4],[4,5,6])
     * @param arr1 {Array} 数组1
     * @param arr2 {Array} 数组2
     * @return {Array} 并集数组
     */
    
     _.union=function(arr1,arr2) {return [...new Set([...arr1, ...arr2])]}
    /** 得到两个数组的交集
     * @module utils
     * @method inter
     * @example LIM.UTILS.inter([1,1,3,4],[4,5,6])
     * @param arr1 {Array} 数组1
     * @param arr2 {Array} 数组2
     * @return {Array} 交集数组
     */
     _.inter=function(arr1,arr2) {return new Set([...arr1].filter(x=>arr2.has(x)))}
     
    /** 得到两个数组a-b的差集
     * @module utils
     * @method diff
     * @example LIM.UTILS.inter([1,1,3,4],[4,5,6])
     * @param arr1 {Array} 数组1
     * @param arr2 {Array} 数组2
     * @return {Array} 差集数组
     */
     _.diff=function(arr1,arr2) {return new Set([...arr1].filter(x=>!arr2.has(x)))}

    /** 反转字符串
     * @module utils
     * @method stringReve
     * @example LIM.UTILS.stringReve("去玩儿他少点")
     * @param str {String} 输入字符串
     * @return {String} 反转字符串 
     */
     _.stringReve=function(str){return str.split("").reverse().join("")}


    /** 专用散列加密
     * @module utils
     * @method angelyamu
     * @example LIM.UTILS.angelyamu("去玩儿他少点",[3,7,11,17,19,23],555)
     * @param q {String} 输入字符串
     * @param p {Array} [秘钥a,秘钥b,秘钥c,秘钥d,秘钥e,秘钥f]
     * @param y {int} 秘钥g
     * @return {String} key
     */
     _.angelyamu=function(q,p,y){
         let a0=[],a1=[],a2=[],i=0,q1=p[0],q2=p[1],o=[],f=[],u=[],g="",b1=[],b2=[],b3=0
         let char=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","+","="]
         for(let s of q) {a0.push(parseInt(Math.pow(s.charCodeAt(0),1/Math.E)*3141%1000));a1.push(parseInt(s.charCodeAt(0)*Math.E));a2.push(parseInt(s.charCodeAt(0)*Math.PI))};
         a2.reverse()
         let item=a1[i]
         while (a1.length<32){q1=(q1*p[2]%p[4])%32;item=a1[i];i=item%a1.length;a1.splice(i,0,(item+(q1%2===0?q1:(q1*-1)))%65535)}
         i=0;
         while (a2.length<32){q2=(q2*p[3]%p[5])%32;item=a2[i];i=item%a2.length;a2.splice(i,0,(item+(q2%2===0?q2:(q2*-1)))%65535)}
         o=[a1[17],a1[18],a1[19],a1[0],a1[1],a1[2],a1[3],a1[4],a1[16],a1[21],a1[20],a1[31],a1[30],a1[29],a1[28],a1[5],a1[15],a1[22],a1[23],a1[24],a1[25],a1[26],a1[27],a1[6],a1[14],a1[13],a1[12],a1[11],a1[10],a1[9],a1[8],a1[7],a2[10],a2[11],a2[12],a2[13],a2[14],a2[15],a2[16],a2[17],a2[9],a2[31],a2[28],a2[27],a2[25],a2[22],a2[21],a2[18],a2[8],a2[30],a2[29],a2[26],a2[24],a2[23],a2[20],a2[19],a2[7],a2[6],a2[5],a2[4],a2[3],a2[2],a2[1],a2[0]]
         f=[o[0]+o[1]+o[2]+o[3]+o[4]+o[5]+o[6]+o[7],o[8]+o[9]+o[10]+o[11]+o[12]+o[13]+o[14]+o[15],o[16]+o[17]+o[18]+o[19]+o[20]+o[21]+o[22]+o[23],o[24]+o[25]+o[26]+o[27]+o[28]+o[29]+o[30]+o[31],o[32]+o[33]+o[34]+o[35]+o[36]+o[37]+o[38]+o[39],o[40]+o[41]+o[42]+o[43]+o[44]+o[45]+o[46]+o[47],o[48]+o[49]+o[50]+o[51]+o[52]+o[53]+o[54]+o[55],o[56]+o[57]+o[58]+o[59]+o[60]+o[61]+o[62]+o[63],o[0]+o[8]+o[16]+o[24]+o[32]+o[40]+o[48]+o[56],o[1]+o[9]+o[17]+o[25]+o[33]+o[41]+o[49]+o[57],o[2]+o[10]+o[18]+o[26]+o[34]+o[42]+o[50]+o[58],o[3]+o[11]+o[19]+o[27]+o[35]+o[43]+o[51]+o[59],o[4]+o[12]+o[20]+o[28]+o[36]+o[44]+o[52]+o[60],o[5]+o[13]+o[21]+o[29]+o[37]+o[45]+o[53]+o[61],o[6]+o[14]+o[22]+o[30]+o[38]+o[46]+o[54]+o[62],o[7]+o[15]+o[23]+o[31]+o[39]+o[47]+o[55]+o[63],o[0],o[7],o[56],o[63],o[1]+o[8],o[6]+o[15],o[55]+o[62],o[48]+o[57],o[2]+o[9]+o[16],o[5]+o[14]+o[23],o[47]+o[54]+o[61],o[40]+o[49]+o[58],o[3]+o[10]+o[17]+o[24],o[4]+o[13]+o[22]+o[31],o[32]+o[41]+o[50]+o[59],o[39]+o[46]+o[53]+o[60],o[11]+o[18]+o[25],o[33]+o[42]+o[51],o[52]+o[45]+o[38],o[12]+o[21]+o[30],o[19]+o[27]+o[26],o[20]+o[28]+o[29],o[36]+o[37]+o[44],o[34]+o[35]+o[43],o[6]+o[13]+o[20]+o[27]+o[34]+o[41]+o[48],o[5]+o[11]+o[17],+o[23]+o[29]+o[35],o[4]+o[9]+o[14]+o[19]+o[24],o[3]+o[7]+o[11]+o[15],o[2]+o[5]+o[8],o[57]+o[50]+o[43]+o[36]+o[29]+o[22]+o[15],o[58]+o[52]+o[46]+o[40]+o[34]+o[28],o[59]+o[54]+o[49]+o[44]+o[39],o[60]+o[56]+o[52]+o[48],o[61]+o[58]+o[55]]
         for(let i=0;i<f.length;i++){let d=a0[i%a0.length];u.push((f[i]*d+(y%p[i%p.length]))%64);if(i%4===2) u.splice(parseInt(i/4)+1,0,(f[i]%d*i)%64)}
         for(let i of u) {b1.push(i);b2.push(i)}
         for(let i=0;i<b1.length;i++){let m=b1[i];let n=b1[m];b1[n]=(m+n)%64}
         for(let i=0;i<b2.length;i++){b3=(b1[i]+b2[(i+b3)%64]+b3)%64;g+=char[(b3+b2[i])%64]}
         return g
     }
     
    /** 对象内数值属性进行排序
     * @module utils
     * @method compare
     * @example LIM.UTILS.sortBy("id",true)
     * @param str {property} 属性
     * @param str {desc} 降序 默认为升序
     */
    _.sortBy=function(property,desc){
        
        return function (v1,v2) {return (v2[property]>v1[property]?1:-1)*(desc?1:-1)}
    }
})(LIM.UTILS);