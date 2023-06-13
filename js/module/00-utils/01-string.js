/** 获取字符串长度
 * @module utils
 * @method getLen
 * @example "按按嗷嗷".getLen()
 * @return {int} 此字符串长度
 */
String.prototype.getLen = function(){
     
    let len=0,l=this.length;
    for (let i=0;i<l;i++) if(this.charCodeAt(i)>255) len+=2;else len++;
    return len
}
/** 字符串拼接
 * @module utils
 * @method splice
 * @example "1234567".splice(1,2,"8888")
 * 
 * @param start {int} 起始位置
 * @param del {int}  截断个数
 * @param newStr {String} 插入字符串
 * @return {String} 拼接后字符串
 */
String.prototype.splice = function(start,del,newStr) {
    return this.slice(0, start) + (newStr||"") + this.slice(start+del)
};

String.prototype.replacePlace = function(arr) {return arr.reduce((result, value, i) => result.replace(new RegExp(`%\\[${i + 1}\\]`, 'g'), value), this);};


