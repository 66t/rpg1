
var Conductor={}

Conductor._path='audio';
Conductor._VolVolume=1;
Conductor._TrajeVolume=[];
Conductor._Buffer={};
Conductor._Effect={}

Conductor.start=function(id,traje){
    let v=$Musical[id]
    if(v) {
        let sound = new Pz.Sound(`${Conductor._path}/${v.folder}/${v.name}.ogg`, () => {
             sound.attack = v.attack || 0;
             sound.release = v.release || 0;
             sound.loop = v.loop || false;
             sound.volume = (v.volume || 1) * Conductor._VolVolume * (Conductor._TrajeVolume[traje] ? Conductor._TrajeVolume[traje] : 1);
             sound.attackCurve = v.attackCurve || 'linear';
             sound.releaseCurve = v.releaseCurve || 'linear';
             sound.play()
        })
        if(traje) Conductor._Buffer[traje]=sound
    }
}
Conductor.pause=function(traje,time){
    if(Conductor._Buffer[traje])
        Conductor._Buffer[traje].pause()
        if(time) setTimeout(()=>{Conductor.play(traje)},time*1000)
}
Conductor.stop=function(traje){
    if(Conductor._Buffer[traje])
        Conductor._Buffer[traje].stop()
        Conductor._Buffer[traje]=null
}
Conductor.play=function(traje){
    if(Conductor._Buffer[traje])
        Conductor._Buffer[traje].play()
}
Conductor.effect=function (traje,type,id,data) {
    if(Conductor._Buffer[traje]){
        if(Conductor._Effect[traje+"-"+id])
            Conductor._Buffer[traje].removeEffect(Conductor._Effect[traje+"-"+id])
        switch (type) {
            default :break
            case "delay":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Delay();break
            case "delayE":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Delay({
                    feedback: data&&data.feedback||0.6,
                    time: data&&data.feedback||0.4,
                    mix: data&&data.feedback||0.5
                });break
            case "ping-pong":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.PingPongDelay({
                    feedback: data&&data.feedback||0.4,
                    time: data&&data.feedback||0.2,
                    mix: data&&data.feedback||0.68
                });break
            case "dub":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.DubDelay({
                    feedback: data&&data.feedback||0.6,
                    time: data&&data.feedback||0.7,
                    mix: data&&data.feedback||0.5,
                    cutoff: data&&data.cutoff||700
                });break
            case "distor":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Distortion({
                    gain: data&&data.gain||0.4
                });break
            case "quad":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Quadrafuzz({
                    lowGain: data&&data.lowGain||0.6,
                    midLowGain: data&&data.midLowGain||0.8,
                    midHighGain: data&&data.midHighGain||0.5,
                    highGain: data&&data.highGain||0.6,
                    mix: data&&data.mix||1.0
                });break
            case "flanger":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Flanger({
                    time: data&&data.time||0.45,
                    speed: data&&data.speed||0.2,
                    depth: data&&data.depth||0.1,
                    feedback: data&&data.feedback||0.1,
                    mix: data&&data.mix||0.5
                });break
            case "reverb":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Reverb({
                    time: data&&data.time||0.01,
                    decay: data&&data.decay||0.01,
                    reverse: data&&data.reverse||false,
                    mix: data&&data.mix||0.5
                });break
            case "tremolo":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Tremolo({
                    speed: data&&data.speed||7,
                    depth: data&&data.depth||0.8,
                    mix: data&&data.mix||0.8
                });break
            case "compressor":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.Compressor({
                    threshold: data&&data.threshold||-24,
                    ratio: data&&data.ratio||12
                });break
            case "pan":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.StereoPanner({
                    pan: data&&data.pan||0.5
                });break
            case "lowpass":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.LowPassFilter({
                    frequency: data&&data.frequency||400,
                    peak: data&&data.peak||10
                });break
            case "highpass":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.HighPassFilter({
                    frequency: data&&data.frequency||2000,
                    peak: data&&data.peak||10
                });break
            case "ring":
                Conductor._Effect[traje+"-"+id]=new Pizzicato.Effects.RingModulator({
                    speed: data&&data.speed||30,
                    distortion: data&&data.distortion||1,
                    mix: data&&data.mix||0.5
                });break







        }
        Conductor._Buffer[traje].addEffect(Conductor._Effect[traje+"-"+id]);
    }
}
