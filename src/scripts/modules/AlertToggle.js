class Alert {
    constructor() {
        this.sound = new Audio('../src/alert.mp3');
        this.pinned = [];
    }

    alertSound(){
        this.sound.loop = false;
        this.sound.play();
    }

    alertStyle(value){
        if (value.change >= .8){
            if (this.pinned.indexOf(value.s) === -1){
                this.pinned.push(value.s)
            }
            this.alertSound();
            document.title =  "Last Alert: " + value.s
            return 'change__container change--alert'
        } else if (value.change > .2){
            return 'change__container'
        } 
        return 'change__container change__hide'
    }

}

export default Alert
