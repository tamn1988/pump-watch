class HandleData {
    constructor() {
        this.dataToExport = undefined;
        this.socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        this.convertArrayToObj = this.convertArrayToObj.bind(this);
        this.filterAndParse = this.filterAndParse.bind(this);
        this.addToDataToExport = this.addToDataToExport.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);
        this.reset = this.reset.bind(this);
        this.reset();
        this.getData();
    }

    reset() {
        setInterval(() => {
            this.dataToExport = {
                BTCUSDT: {
                    current: 0,
                    change: 0,
                    s: 'BTCUSDT',
                    c: 0
                }
            }
        }, 120000)
    }


    getData() {
        this.socket.addEventListener('message', ((event) => {
            let liveData = this.filterAndParse(event);
            //Only add to dataToExport if object has no value
            if (!this.dataToExport) {
                this.dataToExport = this.convertArrayToObj(liveData);
            }
            this.addToDataToExport(liveData);
        }))
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
            //Filter conditions: Only btc pairs with greater than 1k volume
            return altCoin.s.indexOf('BTC') !== -1 && altCoin.q >= 1000
        })
    }

    addToDataToExport(data) {
        data.map((altCoin) => {
            if (altCoin.s === 'BTCUSDT' && this.dataToExport.BTCUSDT.current === 0){
                this.dataToExport.BTCUSDT = altCoin;
            }

            if (!this.dataToExport[altCoin.s]) {
                //Add new altcoins to object that were not available in previous stream.
                this.dataToExport[altCoin.s] = altCoin;
            };
            this.dataToExport[altCoin.s]['change'] = this.roundToTwo((((altCoin.c - this.dataToExport[altCoin.s]['c']) / this.dataToExport[altCoin.s]['c']) * 100), 2);
            this.dataToExport[altCoin.s]['current'] = altCoin.c;
        })
    }

    roundToTwo(num, places) {
        let multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }
}

export default HandleData;





