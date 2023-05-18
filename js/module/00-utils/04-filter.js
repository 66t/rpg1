var LIM=LIM||{};
LIM.UTILS=LIM.UTILS||{};
(function(_){

    _.getFilter=function(type){
        switch (type) {
            case "adj": return new PIXI.filters.AdjustmentFilter()
            case "bloom": return new PIXI.filters.AdvancedBloomFilter()
            case "ascii": return new PIXI.filters.AsciiFilter()
            //
            case "bulge": return new PIXI.filters.BulgePinchFilter()
            //
                
            case "colorRep": return new PIXI.filters.ColorReplaceFilter()
            case "cross": return new PIXI.filters.CrossHatchFilter()
            case "crt": return new PIXI.filters.CRTFilter()
            //
            case "dot": return new PIXI.filters.DotFilter()
            case "emboss": return new PIXI.filters.EmbossFilter()
            case "glitch": return new PIXI.filters.GlitchFilter()
            case "glow": return new PIXI.filters.GlowFilter()
            //
            case "motion": return new PIXI.filters.MotionBlurFilter([100,100],3,10)
            //
            case "outline": return new PIXI.filters.OutlineFilter()
            case "old": return new PIXI.filters.OldFilmFilter()
            case "pixel": return new PIXI.filters.PixelateFilter()
            case "radial": return new PIXI.filters.RadialBlurFilter(100,{x:0,y:0})
            //
            case "rgb": return new PIXI.filters.RGBSplitFilter([0,0],[0,0],[0,0])
            //
            case "tiltX": return new PIXI.filters.TiltShiftXFilter()
            case "tiltY": return new PIXI.filters.TiltShiftYFilter()
            case "twist": return new PIXI.filters.TwistFilter()
            case "zoom": return new PIXI.filters.ZoomBlurFilter()
                
        }
    }
})(LIM.UTILS)