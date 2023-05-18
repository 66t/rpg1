var LIM=LIM||{};
LIM.RORUE=LIM.RORUE||{};
(function(_) {
    _.Room=function(){this.initialize.apply(this,arguments)}
    _.Room.prototype=Object.create(_.Room.prototype)
    _.Room.prototype.constructor=_.Room

    Object.defineProperties(_.Room.prototype, {
        room_id:{get: function () {return this.y*this.rogue.x+this.x}, configurable: true},
        room_up: {get: function () {return (this.room_id/this.rogue.x<1)?null:this.rogue.Room[this.room_id-this.rogue.x]}, configurable: true},
        room_down: {get: function () {return (this.room_id/this.rogue.x>this.rogue.y-1)?null:this.rogue.Room[this.room_id+this.rogue.x]}, configurable: true},
        room_left: {get: function () {return (this.room_id%this.rogue.x==0)?null:this.rogue.Room[this.room_id-1]}, configurable: true},
        room_right: {get: function () {return (this.room_id%this.rogue.x==this.rogue.x-1)?null:this.rogue.Room[this.room_id+1]}, configurable: true},
        //周围房间
        room_neigh:{get: function () {return [this.room_down,this.room_left,this.room_right,this.room_up].filter(item=>{return item})}, configurable: true},
        //周围使用的房间
        room_exin:{get: function () {return this.room_neigh.filter(item=>{return item.exist})}, configurable: true},
        //周围空房间
        room_vain:{get: function () {return this.room_neigh.filter(item=>{return !item.exist})}, configurable: true},
        //周围同级房间
        room_equative:{get: function () {return this.room_exin.filter(item=>{return item.scope==this.scope})}, configurable: true},
        //可通行房间
        room_way:{get: function () {return this.room_exin.filter(item=>{return this.door.indexOf(item.room_id)>-1})}, configurable: true},
        //不可通行房间
        room_cut:{get: function () {return this.room_exin.filter(item=>{return this.door.indexOf(item.room_id)==-1})}, configurable: true},

        //同级可通行房间
        room_equa_way:{get: function () {return this.room_equative.filter(item=>{return this.door.indexOf(item.room_id)>-1})}, configurable: true},
        //同级不可通行房间
        room_equa_cut:{get: function () {return this.room_equative.filter(item=>{return this.door.indexOf(item.room_id)==-1})}, configurable: true},
        //空间距离
        abs_distance:{get: function () {
                let arr=[];for(let i=0;i<this.rogue.Room.length;i++) arr[i]=-1
                if(this.exist){
                    arr[this.room_id]=0
                    return this.absDistance(arr,1)
                } else return arr}, configurable: true},
        //路径距离
        way_distance:{get: function () {
                let arr=[];for(let i=0;i<this.rogue.Room.length;i++) arr[i]=-1
                if(this.exist){
                    arr[this.room_id]=0
                    return this.wayDistance(arr,1)
                } else return arr}, configurable: true},
        //空旷房间
        wide_Room:{get: function () {
                let max=0
                for(let i=0;i<this.room_vain.length;i++) max=Math.max(this.room_vain[i].room_diff,max)
                return this.room_vain.filter(item=>{return item.room_diff==max});}, configurable: true},
        //扩散1次后空房间数量
        room_diff:{get: function () {return this.room_vain.reduce(function(r, item) {return r+item.room_vain.length}, 0)}}
       });

    _.Room.prototype.initialize=function(x,y,rogue){
        this.rogue=rogue
        this.exist=false
        this.x=x
        this.y=y
        this.index=0
        this.scope=0
        this.prev=null
        this.door=[-1,-1,-1,-1]
    };

    _.Room.prototype.padExist=function(){
        try {
            switch (this.rogue.mode){
                default:
                    this.padDiff(this.rogue.mode-2)
                    break
                case 1:
                case 0:
                    this.padVici(2)
                    break
            }
        }
        catch (e){console.log(e)}
        let pad=this.rogue.gatPad()
        if(pad)pad.padSpace()
    }
    _.Room.prototype.padVici=function(def,prev){
        if (this.rogue.use <= this.rogue.use_len) return
        else if(def+1==this.rogue.mode&&this.prev) this.prev.padVici(2)
        else {
            if (this.prev==null && prev) this.prev = prev
            this.exist = true
            if (this.rogue.use > this.rogue.use_len) {
                if (this.room_vain.length>def) {
                   this.room_vain[this.room_vain.length>1?LIM.$data.pro(300 + (this.rogue.use_len % 50), this.room_vain.length):0].padVici(def, this)
                }
                else this.padVici(def-1)
            }
        }
    }
    _.Room.prototype.padDiff=function(def,prev){
        if (this.rogue.use <= this.rogue.use_len) return
        let min=0;let arr=[]
        if (this.prev==null && prev) this.prev = prev
        this.exist = true

        for (let i = 0; i < this.room_vain.length; i++) {
              if(this.room_vain[i].room_diff>def)
                if (this.room_vain[i].room_diff > min) {
                    arr = []
                    min = this.room_vain[i].room_diff
                    arr.push(this.room_vain[i])
                }
                else if (this.room_vain[i].room_diff == min)
                   arr.push(this.room_vain[i])
            }
        if (arr.length) {
            arr[arr.length>1?LIM.$data.pro(300 + (this.rogue.use_len % 50), arr.length):0].padDiff(def,this)
        }
        else if(this.prev) this.prev.padDiff(def)
    }

    //计算距离表
    _.Room.prototype.absDistance=function (arr,d){
      let Room=this.room_exin.filter(item =>{return item.exist})
      let next=[]
      for(let i=0;i<Room.length;i++) if(arr[Room[i].room_id]==-1){arr[Room[i].room_id]=d;next.push(i)}
      for(let i=0;i<next.length;i++) arr=Room[next[i]].absDistance(arr,d+1)
      return arr
    }

    //计算通行距离表
    _.Room.prototype.wayDistance=function (arr,d){
        let Room=this.room_way.filter(item =>{return item.exist})
        let next=[]
        for(let i=0;i<Room.length;i++) if(arr[Room[i].room_id]==-1){arr[Room[i].room_id]=d;next.push(i)}
        for(let i=0;i<next.length;i++) arr=Room[next[i]].wayDistance(arr,d+1)
        return arr
    }

    //填充
    _.Room.prototype.padSpace=function (){
        if(this.wide_Room.length)
            this.wide_Room[LIM.$data.pro(300 + (this.rogue.use_len % 50), this.wide_Room.length)].exist = true
        let pad=this.rogue.gatPad()
        if(pad)pad.padSpace()
    }

    //开门
    _.Room.prototype.trailBlaze=function (bool){
         if(bool) {
             let next = this.room_cut[LIM.$data.pro(300 + (this.room_id % 50), this.room_cut.length)]
             if (next) {
                 if (this.room_down == next) {
                     this.door[0] = next.room_id;
                     next.door[3] = this.room_id
                 } else if (this.room_left == next) {
                     this.door[1] = next.room_id;
                     next.door[2] = this.room_id
                 } else if (this.room_right == next) {
                     this.door[2] = next.room_id;
                     next.door[1] = this.room_id
                 } else if (this.room_up == next) {
                     this.door[3] = next.room_id;
                     next.door[0] = this.room_id
                 }
             }
         }
         else {
             let next=this.room_equa_cut[LIM.$data.pro(300 + (this.room_id % 50),this.room_equa_cut.length)]
             if(next){
                 if(this.room_down==next) {this.door[0]=next.room_id;next.door[3]=this.room_id}
                 else if(this.room_left==next){this.door[1]=next.room_id;next.door[2]=this.room_id}
                 else if(this.room_right==next){this.door[2]=next.room_id;next.door[1]=this.room_id}
                 else if(this.room_up==next){this.door[3]=next.room_id;next.door[0]=this.room_id}
             }
         }
    }
})(LIM.RORUE)
