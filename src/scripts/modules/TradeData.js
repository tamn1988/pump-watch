class TradeData {
    constructor() {
        this.dataOut = [];
        this.convertData = this.convertData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);

    }
    convertData(data) {
        data.forEach((item) => {
            this.dataOut.push({
                price: this.roundToTwo(item.price, 9),
                qty: this.roundToTwo(item.qty, 6),
                time: new Date(item.time).toTimeString().slice(0, 8),
                id: item.id
            })
        })
        this.dataOut.reverse();
    }

    fetchData(coin) {
        let apiLink = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/trades?symbol=' + coin + '&limit=35';
        fetch(apiLink)
            .then((response)=>{
                if (!response.ok){
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((response)=>{
                this.dataOut=[];
                this.convertData(response);
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    roundToTwo(num, places) {
        let multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }
}

export default TradeData
