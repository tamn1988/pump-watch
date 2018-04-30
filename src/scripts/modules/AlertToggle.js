class Alert {
    constructor() {
        this.sound = new Audio('../src/alert.mp3');
    }

    alertSound(){
        this.sound.loop = false;
        this.sound.play();
    }

    alertStyle(value){
        if (value.change >= .8){
            // this.alertSound();
            document.title = value.s
            return 'change__container change--alert'
        } else if (value.change > 0){
            return 'change__container'
        } 
        return 'change__hide'
    }

}

export default Alert
