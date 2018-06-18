const buildApiLinks = (coin, cors) => {
    console.log('new build');
    console.log(cors)
    if (cors === 'yes') {
        return {
            tradeAPI: 'https://api.binance.com/api/v1/trades?symbol=' + coin + '&limit=35',
            bookAPI: 'https://api.binance.com/api/v1/depth?symbol=' + coin + '&limit=20',
            chartAPI: 'https://api.binance.com/api/v1/klines?symbol=' + coin + '&interval=15m&limit=500'
        }
    } 
    return {
        tradeAPI: 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/trades?symbol=' + coin + '&limit=35',
        bookAPI: 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/depth?symbol=' + coin + '&limit=20',
        chartAPI: 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/klines?symbol=' + coin + '&interval=15m&limit=500'
    }
}
//
const roundToTwo = (num, places) => {
    let multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

const convertDataTrade = (data) => {
    let tradeData = [];
    data.forEach((item) => {
        tradeData.push({
            price: roundToTwo(item.price, 9),
            qty: roundToTwo(item.qty, 6),
            time: new Date(item.time).toTimeString().slice(0, 8),
            id: item.id
        })
    })
    tradeData.reverse();
    return tradeData;
}

const convertDataBook = (data) => {
    let bookData = {
        bids: [],
        asks: []
    }
    data.bids.forEach((item) => {
        bookData.bids.push({
            price: item[0],
            amount: roundToTwo(item[1], 6)
        })
    })
    data.asks.forEach((item) => {
        bookData.asks.push({
            price: item[0],
            amount: roundToTwo(item[1], 6)
        })
    })
    bookData.asks.reverse();
    return bookData;
}

const convertDataChart = (data) => {
    let chartData = data.map((item) => {
        return {
            close: Number(item[4]),
            time: item[6]
        }
    })
    return chartData;
}
export { convertDataChart, convertDataBook, convertDataTrade, buildApiLinks };

