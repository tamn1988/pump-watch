class Alert {
    constructor() {
        this.pinned = [];
    }

    alertStyle(value){
        if (value.change >= .8){
            if (this.pinned.indexOf(value.s) === -1){
                this.pinned.push(value.s)
            }
            document.title =  "Last Alert: " + value.s
            return 'change__container change--alert'
        } else if (value.change > .2){
            return 'change__container'
        } 
        return 'change__container change__hide'
    }

}

export default Alert
