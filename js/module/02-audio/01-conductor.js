
var Conductor={}

Conductor._path='audio';
Conductor._VolVolume=0.2;
Conductor._TrajeVolume=[];
Conductor._Buffer={};
Conductor._Effect={}
Conductor._id=0
Conductor.start=function(data) {
    let player = new Tone.Player().toDestination();
    data.id=++Conductor._id
    let vol=data.volume*Conductor._VolVolume*(Conductor._TrajeVolume[data.traje]||1)
    
    if(data.fade) {
        player.fadeIn = data.fade[0];
        player.fadeInCurve = data.fade[2];
        player.fadeOut = data.fade[1];
        player.fadeOutCurve = data.fade[3];
    }
    if(data.rate) player.playbackRate = data.rate;
    if(data.reverse)player.reverse = data.reverse;
    
    if(data.loop) {
        player.loop = data.loop[0];
        if (player.loop) {
            player.loopStart = data.loop[1]
            player.loopEnd = data.loop[2];
        }
    }
    let src =Conductor._path+"/" + data.type + "/" + data.name + ".ogg"

    
    player.load(src).then(() => {
        if(data.pan)
          data.pan=[parseFloat(data.pan[0]),parseFloat(data.pan[1])]
        player.volume.value = vol*100-100
        
        if(data.pan)
          if(data.pan[0]||data.pan[1]){
            const panvol = new Tone.PanVol(data.pan[0],data.pan[1])
            player.connect(panvol);
            panvol.toDestination();
        }
        if(data.dis)
          if(data.dis[0]) {
            const distortion = new Tone.Distortion({
                distortion: data.dis[0],
                oversample: data.dis[1]
            });
            player.connect(distortion);
            distortion.toDestination();
        }
        if(data.bit)
          if(data.bit[1]) {
            const overdrive = new Tone.BitCrusher({
                bits:data.bit[0],     
                wet: data.bit[1],
            });
            player.connect(overdrive);
            overdrive.toDestination();
        }

        if(data.filter)
          if(data.filter[0]!=="none"){
            const filter = new Tone.Filter({
                type: data.filter[0],
                frequency: Number(data.filter[1]),
                rolloff: Number(data.filter[2]),
                Q: Math.pow(10,Number(data.filter[3])),
                gain: Number(data.filter[4]),
            })
            player.connect(filter);
            filter.toDestination();
        }
        
        player.start("+0", data.time[0])
        if(data.time[1]) {
            if(data.traje)
                setTimeout(function (){
                    if(Conductor._Buffer[data.traje].data.id===data.id) {
                        Conductor._Buffer[data.traje].play.stop(data.fade[1]);
                        Conductor._Buffer[data.traje] = null}
                },(data.time[1]-data.fade[1])*1000)
            else
                setTimeout(function (){
                    player.stop(data.fade[1]);
                },(data.time[1]-data.fade[1])*1000)
        }
        if(data.traje) {
            let old=Conductor._Buffer[data.traje]
            if(old) {old.play.stop(old.data.fade[1])}
            Conductor._Buffer[data.traje]={play:player,data:data}
        }
    })
}

