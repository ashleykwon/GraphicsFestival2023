export class Device {
    constructor(){
        this.mode = 'OFF';
        this.autoFunc = () => {};
        this.playFunc = () => {};
        this.playCallback = () => {};
        this.playStartTime = 0;
        this.playLength = 0;
    }

    setModeOff(){
        this.mode = 'OFF';
        this.object.visible = false;
    }

    setModeAuto(autoFunc){
        this.mode = 'AUTO';
        if(autoFunc !== undefined) this.autoFunc = autoFunc;
        this.object.visible = true;
    }

    setModePlay(playFunc, playCallback, time){
        this.mode = 'PLAY';
        if(playFunc !== undefined) this.playFunc = playFunc;
        if(playCallback !== undefined) this.playCallback = playCallback;
        this.playStartTime = new Date().getTime();
        this.playLength = time;
        this.object.visible = true;
    }

    update(t){
        if(this.mode === 'OFF'){
            return;
        } 
        
        else if(this.mode === 'AUTO'){
            if(this.autoFunc === undefined) throw Error("autoFunc not defined for device");
            this.autoFunc(t, this);
        } 
        
        else if(this.mode === 'PLAY'){
            this.playFunc(t, this);
            
            if(new Date().getTime() - this.playStartTime > this.playLength){
                this.playCallback(t, this);
                this.setModeOff();
            }
        }
    }
}