class HandleData {
    constructor() {
        this.dataToExport = undefined;
        this.socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        this.getStartingDataToCompare = this.getStartingDataToCompare.bind(this);
        this.convertArrayToObj = this.convertArrayToObj.bind(this);
        this.filterAndParse = this.filterAndParse.bind(this);
        this.addToDataToExport = this.addToDataToExport.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);
        this.reset = this.reset.bind(this);
        this.reset();
        this.getData();
    }

    reset(){
        setInterval( ()=>{
            this.dataToExport = undefined;
            console.log('reset');
        }, 60000)
    }

    getData() {
        this.socket.addEventListener('message', ((event) => {
            if (!this.dataToExport) {
                this.getStartingDataToCompare(event);
                this.dataToExport = this.convertArrayToObj(this.dataToExport);
            }
            let liveData = this.filterAndParse(event);
            this.addToDataToExport(liveData);
        }))
    }

    getStartingDataToCompare(event) {
        if (!this.dataToExport) {
            this.dataToExport = this.filterAndParse(event);
        }
    }

    convertArrayToObj(array) {

        const arrayToObject = (array) =>
            array.reduce((obj, item) => {
                obj[item.s] = item
                return obj
            }, {})

        return arrayToObject(array);
    }

    filterAndParse(data) {
        return JSON.parse(data.data).filter((altCoin) => {
            return altCoin.s.indexOf('BTC') !== -1 && altCoin.q >= 1000;
        })
    }

    addToDataToExport(data) {
        data.map((altCoin) => {
            if (!this.dataToExport[altCoin.s]) {
                this.dataToExport[altCoin.s] = altCoin;
            };
            this.dataToExport[altCoin.s]['change'] = this.roundToTwo((((altCoin.c - this.dataToExport[altCoin.s]['c']) / this.dataToExport[altCoin.s]['c']) * 100), 2)
        })
    }

    roundToTwo(num, places) {
        let multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }
}

export default HandleData

