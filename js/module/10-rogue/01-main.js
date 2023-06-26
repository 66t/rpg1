var LIM=LIM||{};
LIM.RORUE=LIM.RORUE||{};
((_)=>{
    _.Main=function(){this.initialize.apply(this,arguments)}
    _.Main.prototype=Object.create(_.Main.prototype)
    _.Main.prototype.constructor=_.Main

    Object.defineProperties(_.Main.prototype, {
        use_len: {get: function () {return this.use_room.length;}, configurable: true},
        use_room: {get: function () {return this.room.filter(item=>{return item.exist});}, configurable: true},
        room_scope: {get: function () {
            return [
                this.room.filter(item=>{return item.scope==0}),
                this.room.filter(item=>{return item.scope==1}),
                this.room.filter(item=>{return item.scope==2}),
                this.room.filter(item=>{return item.scope==3}),
                this.room.filter(item=>{return item.scope==4}),
                this.room.filter(item=>{return item.scope==5}),
                this.room.filter(item=>{return item.scope==6}),
                this.room.filter(item=>{return item.scope==7})
            ];
            }, configurable: true},

        way: {get: function () {
                let arr=[]
                for(let i=0;i<this.room.length;i++)
                  arr[i]=this.room[i].way_distance.reduce(function(r, item) {return r+item}, 0)
                return arr;
            }, configurable: true},
        //空旷房间
        wide_room: {get: function () {
            let max=0
            for(let i=0;i<this.use_room.length;i++) max=Math.max(this.use_room[i].room_diff,max)
            return this.use_room.filter(item=>{return item.room_diff==max});}, configurable: true
        },
    });
    _.Main.prototype.initialize=function(x,y,use,mode){
         this.room=[]
         this.use=Math.min(use,x*y)
         this.x=x
         this.y=y
         this.mode=mode
         this.initSpace()
         this.initScope()
         this.initWay()
    };
    //制造空间
    _.Main.prototype.initSpace=function (){
        for(let i=0;i<this.x*this.y;i++)
            this.room[i]= new _.ROOM(i%this.x,parseInt(i/this.x),this)
        this.room[LIM.$data.pro(299, this.x*this.y)].padExist()
    }
    //划分区域
    _.Main.prototype.initScope=function (){
        this.triangle=[]
        while (this.triangle.length<3){
            let num=LIM.$data.pro(299,this.use_room.length)
            if(this.triangle.indexOf(num)==-1) this.triangle.push(num)
        }
        this.origin=[]
        for(let i=0;i<this.room.length;i++)
            this.origin[i]=Math.abs(this.use_room[this.triangle[0]].abs_distance[i]+this.use_room[this.triangle[2]].abs_distance[i]-this.use_room[this.triangle[1]].abs_distance[i])
        let min=Math.min(...this.origin.filter(item=>{return item>-1}))
        let max=Math.max(...this.origin)
        let state=parseInt((max-min)/7)
        for(let i=0;i<this.room.length;i++)
            this.room[i].scope=Math.min(this.room[i].exist?(parseInt((this.origin[i]-min)/state)+1):0,7)
    }
    //最初开路
    _.Main.prototype.initWay=function (){
        let count=0
        for(let i=1;i<8;i++){
            let l=5
            let arr=this.room_scope[i].filter(item=>{return item.room_equa_cut.length>0&&item.room_way.length==0})
            if(arr.length) {
                for (let j = 0; j < arr.length; j++) {
                    l = Math.min(arr[j].room_equa_cut.length, l)
                }
                arr = this.room_scope[i].filter(item => {return item.room_equa_cut.length == l})
                count+=arr.length
                if (arr.length)
                    arr[LIM.$data.pro(299, arr.length)].trailBlaze(false)
            }
        }

        if(count) this.initWay()
        else this.dredgeWay()
    }

    //功能区
    _.Main.prototype.initAlity=function (){}

    //打通区域
    _.Main.prototype.dredgeWay=function (){
        let zone=[]
        let arr=[]
        for(let item of this.use_room)
            if(arr.indexOf(item.room_id)==-1){
                let p=[]
                for(let i=0;i<item.way_distance.length;i++)
                    if(item.way_distance[i]>-1) {p.push(i); arr.push(i)}
                zone.push(p)
            }
        if(zone.length>1) {
            let min = this.x * this.y
            for (let item of zone) min = Math.min(min, item.length)
            zone = zone.filter(item => {
                return item.length == min
            })
            zone = zone[LIM.$data.pro(299, zone.length)].filter(item => {return this.room[item].room_cut.length > 0})
            this.room[zone[LIM.$data.pro(299, zone.length)]].trailBlaze(true)
            this.dredgeWay()
        }
    }
    
    //填充
    _.Main.prototype.gatPad=function (){
        if(this.use_len<this.use){
           return  this.wide_room[this.wide_room.length>1?LIM.$data.pro(300 + (this.use_len % 50), this.wide_room.length):0]
        }
    }
})(LIM.RORUE)