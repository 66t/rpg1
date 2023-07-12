var LIM=LIM||{};
LIM.SCENE=LIM.SCENE||{};

((_)=> {
    
    _.Filter = function () { this.initialize.apply(this, arguments) }
    _.Filter.prototype = Object.create(_.Filter.prototype);
    _.Filter.prototype.constructor = _.Filter;
    _.Filter.prototype.initialize = function () {this.filter={}}
    _.Filter.prototype.createFilter = function (key,val) {
        let app=this.dataFilter(val.type)
        this.filter[key]={app:app,data:val,time:0,acti:val.acti}
        for(let uniforms in val.uniforms){
            let src=uniforms.split(".")
            let d1= app
            let d2= app.uniforms
            for(let i=0;i<src.length;i++){
                if(i===src.length-1) {
                    if(d1) d1[src[i]]= val.uniforms[uniforms]
                    if(d2) d2[src[i]]= val.uniforms[uniforms]
                }
                else {
                    if(d1) d1=d1[src[i]];
                    if(d2) d2=d2[src[i]]}

            }
        }
    }
    _.Filter.prototype.updateFilter = function () {
        let bool=false
        let s=""
        for(let key in this.filter) {
            let filter = this.filter[key]
            if (filter.acti) {
            bool = bool || filter.data.cease
            s+=":"+key
            let time = filter.time++
            let data = LIM.UTILS.countWave(filter.data.wave, [100, time], filter.app.uniforms)
            for (let uniforms in data) {
                let src = uniforms.split(".")
                let d1 = filter.app
                let d2 = filter.app.uniforms
                for (let i = 0; i < src.length; i++) {
                    if (i === src.length - 1) {
                        if (d1) d1[src[i]] = data[uniforms]
                        if (d2) d2[src[i]] = data[uniforms]
                    } else {
                        if (d1) d1 = d1[src[i]];
                        if (d2) d2 = d2[src[i]]
                    }
                }
            }
            if (filter.data.cycle > 0 && time > filter.data.cycle) {filter.acti = false}
           }
        }
        return [bool,s]
    }
    _.Filter.prototype.dataFilter = function (type){
        switch (type) {
            case "adj": return new PIXI.filters.AdjustmentFilter()
            case "bloom": return new PIXI.filters.AdvancedBloomFilter()
            case "ascii": return new PIXI.filters.AsciiFilter()
            case "bulge": return new PIXI.filters.BulgePinchFilter()
            case "colorRep": return new PIXI.filters.ColorReplaceFilter()
            case "cross": return new PIXI.filters.CrossHatchFilter()
            case "crt": return new PIXI.filters.CRTFilter()
            case "dot": return new PIXI.filters.DotFilter()
            case "emboss": return new PIXI.filters.EmbossFilter()
            case "glitch": return new PIXI.filters.GlitchFilter()
            case "glow": return new PIXI.filters.GlowFilter()
            case "motion": return new PIXI.filters.MotionBlurFilter([100,100],3,10)
            case "outline": return new PIXI.filters.OutlineFilter()
            case "old": return new PIXI.filters.OldFilmFilter()
            case "pixel": return new PIXI.filters.PixelateFilter()
            case "kawa": return new PIXI.filters.KawaseBlurFilter()
            case "radial": return new PIXI.filters.RadialBlurFilter(100,{x:0,y:0})
            case "rgb": return new PIXI.filters.RGBSplitFilter([0,0],[0,0],[0,0])
            case "tiltX": return new PIXI.filters.TiltShiftXFilter()
            case "tiltY": return new PIXI.filters.TiltShiftYFilter()
            case "twist": return new PIXI.filters.TwistFilter()
            case "zoom": return new PIXI.filters.ZoomBlurFilter()
        }
    }

})(LIM.SCENE);