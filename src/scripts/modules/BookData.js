class BookData {
    constructor() {
        this.dataOut = {
            asks: [],
            bids: []
        };
        this.convertData = this.convertData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);
    }
    convertData(data) {

        data.bids.forEach((item)=>{
            this.dataOut.bids.push({
              price:item[0],
              amount:this.roundToTwo(item[1], 6)
            })
          })
          data.asks.forEach((item)=>{
            this.dataOut.asks.push({
              price:item[0],
              amount:this.roundToTwo(item[1], 6)
            })
          })
        this.dataOut.asks.reverse();
    }

    fetchData(coin) {
        let apiLink = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/depth?symbol=' + coin + '&limit=20';
        fetch(apiLink)
        .then((response)=>{
            if (!response.ok){
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((response)=>{
            this.dataOut= {
                asks: [],
                bids: []
            }
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

export default BookData
