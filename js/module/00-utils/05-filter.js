//===========================
// @-05-f
// @Path      js/module/00-utils
// @author    清澈淌漾
// @email     einatu@yeah.net
// @version   Date(2023/6/17)
// ©2023 limpid
//===========================
LIM.Filter=function(type){
    switch (type) {
        //  alpha: 1 (透明度：1)
        //  blue: 1 (蓝色：1)
        //  brightness: 1 (亮度：1)
        //  contrast: 1 (对比度：1)
        //  curvature: 3.252466 (曲率：3.252466)
        //  gamma: 1 (伽马：1)
        //  green: 1 (绿色：1)
        //  lineContrast: 0.8373767 (线条对比度：0.8373767)
        //  lineWidth: 3.3495068 (线条宽度：3.3495068)
        //  red: 1 (红色：1)
        //  saturation: 1 (饱和度：1)
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