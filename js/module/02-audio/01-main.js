var vol={
    v1:{folder:"bgs",name:"melo",pos:0,bool:true,volume:100,pitch:100,pan:0}
}
function Conductor() {}

Conductor._path='audio/';
Conductor._VolVolume=100;  //总音量  
Conductor._Buffer={}; //缓存
Conductor._current={}; //数据
Conductor._num=0
/**播放Vol (Vol,位置) */
Conductor.play=function(name,kont){
    let vb=vol[name]
    return Conductor.playVol({
        kont:kont, folder:vb.folder, name:vb.name, 
        pos:vb.pos, bool:vb.bool, volume:vb.volume, pitch:vb.pitch, pan:vb.pan})
}
Conductor.playVol = function(vol){
    if (this.isCurrentVol(vol)) {
        this.updateVolParameters(vol);
    } 
    else if(vol.kont) {
        this.stopVol(vol.kont);
        if (vol.folder&&vol.name) {
            this._Buffer[vol.kont] = this.createBuffer(vol.folder, vol.name);
            this.updateVolParameters(vol);
            this._Buffer[vol.kont].play(vol.bool?true:false,vol.pos||0);
            this.updateCurrentVol(vol)
            return vol.kont
        }
    }
    else if (vol.folder&&vol.name){
        let num=Conductor._num++
        this._Buffer[num] = this.createBuffer(vol.folder, vol.name);
        this._Buffer[num].play(vol.bool?true:false,vol.pos||0);
        return Conductor._num
    }
}
Conductor.createBuffer = function(folder, name) {
    let ext = ".ogg"
    let url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    return new WebAudio(url);
}
Conductor.stopVol = function(kont) {
    if (this._Buffer[kont]) {
        this._Buffer[kont].stop();
        this._Buffer[kont] = null;
        this._current[kont] = null;
    }
}
Conductor.fadeOutMe = function(kont,duration) {
    if (this._Buffer[kont]) {
        this._Buffer[kont].fadeOut(duration);
    }
    
};

Conductor.isCurrentVol = function(vol) {return (vol.kont&&this._current[vol.kont] && this._Buffer[vol.kont] && this._current[vol.kont].name === vol.name)}
    
Conductor.makeEmptyAudioObject = function() {return { kont:"null",folder:'',name: '',volume:0,pitch:0,pan:0};}

Conductor.updateVolParameters = function(vol) {this.updateBufferParameters(this._Buffer[vol.kont], this._VolVolume, vol);};
Conductor.updateCurrentVol = function(vol) {
    this._current[vol.kont]= {folder:vol.folder,name:vol.name ,volume:vol.volume ,pitch:vol.pitch ,pan:vol.pan ,pos:vol.pos};
}
Conductor.updateBufferParameters = function(buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 100) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
}

Conductor.saveVol = function(kont) {
    if (this._current[kont]) {
        let vol = this._current[kont];
        return {
            kont: vol.kont,
            folder: vol.folder,
            name: vol.name,
            volume: vol.volume,
            pitch: vol.pitch,
            pan: vol.pan,
            pos: this._Buffer[kont] ? this._Buffer[kont].seek():0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
}
