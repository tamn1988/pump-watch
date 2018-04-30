import $ from 'jquery';

class ChartData {
    constructor(){
        this.formattedData;
        this.fetchData = this.fetchData.bind(this);
        this.convertData = this.convertData.bind(this);
    }

    convertData(data){
        this.formattedData = data.map((item)=>{
            return {
                close: Number(item[4]),
                time: item[6]
            }
        })
    }

    fetchData(coin){
        let apiLink = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v1/klines?symbol=' + coin + '&interval=15m&limit=500';
        $.getJSON(apiLink, ((data)=>{
            this.convertData(data)
        }))
    }
}

export default ChartData



