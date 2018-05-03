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
}

export default ChartData



