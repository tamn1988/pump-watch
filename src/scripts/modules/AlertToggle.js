import moment from 'moment';

class Alert {
    constructor() {
        this.pinned = [];
        this.notify = this.notify.bind(this);
        this.discord = this.discord.bind(this);
        this.discordHook = 'https://discordapp.com/api/webhooks/462860905659498508/60FnlfgaN5x6tPsKhCzh5kBbSbxanDNu9WTwvSuHpVIsYna10GxSDBBVR3DhSnE6euvb';
    }

    alertStyle(value) {
        if (value.change >= .8 && value.volumeChange >= .5) {
            if (this.pinned.indexOf(value.s) === -1) {
                this.pinned.push(value.s)
                this.notify(value)
                this.discord(value)
            }
            document.title = "Last Alert: " + value.s

            return 'change__container change--alert'
        } else if (value.change > .2) {
            return 'change__container'
        }
        return 'change__container change__hide'
    }

    discord(coin) {
        const formData = new FormData();
        formData.append('content', 'Coin:   ' + coin.s + '\nChange:   ' + coin.change + "% \nVolume:   " + coin.volumeChange + '% \n' + moment().format('MMMM Do YYYY, h:mm:ss a'));

        const request = new XMLHttpRequest()
        request.open('POST', this.discordHook);
        request.send(formData);
    }

    notify(coin) {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission((perm) => {
                console.log(perm)
            })
        }

        let notification = new Notification(coin.s);
        setTimeout(notification.close.bind(notification), 4000);
    }
}

export default Alert
