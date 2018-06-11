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
            this.dataToExport = undefined;
            console.log('reset');
        }, 120000)
    }


    getData() {
        this.socket.addEventListener('message', ((event) => {
            let liveData = this.filterAndParse(event);
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
            return altCoin.s.indexOf('BTC') !== -1 && altCoin.q >= 1000;
        })
    }

    addToDataToExport(data) {
        data.map((altCoin) => {
            if (!this.dataToExport[altCoin.s]) {
                this.dataToExport[altCoin.s] = altCoin;
            };
            let percentChange = this.roundToTwo((((altCoin.c - this.dataToExport[altCoin.s]['c']) / this.dataToExport[altCoin.s]['c']) * 100), 2)
            this.dataToExport[altCoin.s]['change'] = percentChange;
            this.dataToExport[altCoin.s]['current'] = altCoin.c;
        })
    }

    roundToTwo(num, places) {
        let multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }
}

export default HandleData

// const buildApiLinks = (coin) => {
//     return {
//         tradeAPI: 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/trades?symbol=' + coin + '&limit=35',
//         bookAPI: 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/depth?symbol=' + coin + '&limit=20',
//         chartAPI: 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/klines?symbol=' + coin + '&interval=15m&limit=500'
//     }
// }

// const roundToTwo = (num, places) => {
//     let multiplier = Math.pow(10, places);
//     return Math.round(num * multiplier) / multiplier;
// }

// const convertDataTrade = (data) => {
//     let tradeData = [];
//     data.forEach((item) => {
//         tradeData.push({
//             price: roundToTwo(item.price, 9),
//             qty: roundToTwo(item.qty, 6),
//             time: new Date(item.time).toTimeString().slice(0, 8),
//             id: item.id
//         })
//     })
//     tradeData.reverse();
//     return tradeData;
// }

// const convertDataBook = (data) => {
//     let bookData = {
//         bids: {},
//         asks: {}
//     }
//     data.bids.forEach((item) => {
//         bookData.bids.push({
//             price: item[0],
//             amount: roundToTwo(item[1], 6)
//         })
//     })
//     data.asks.forEach((item) => {
//         bookData.asks.push({
//             price: item[0],
//             amount: roundToTwo(item[1], 6)
//         })
//     })
//     bookData.asks.reverse();
//     return bookData;
// }

// const convertDataChart = (data) => {
//     let chartData = data.map((item) => {
//         return {
//             close: Number(item[4]),
//             time: item[6]
//         }
//     })
//     return chartData;
// }

// const fetchData = (coinAPI, func) => {
//     fetch(coinAPI)
//         .then((response) => {
//             if (!response.ok) {
//                 throw Error(response.statusText);
//             }
//             return response.json();
//         })
//         .then((response) => {
//            console.log(func(response));
//         })
//         .catch((error) => {
//             console.log(error)
//         })
// }

// const link = buildApiLinks('BNBBTC').tradeAPI;
// const data = fetchData(link, convertDataTrade);
// console.log(data);

