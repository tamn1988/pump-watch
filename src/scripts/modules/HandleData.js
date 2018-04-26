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

// let template = Object.keys(this.dataToExport).map((key, i) => {
//                 return (
//                     <div className="container" key={this.dataToExport[key]['s']}>
//                         <h3 key={this.dataToExport[key]['s'] + 'name'}>{this.dataToExport[key]['s']}</h3>
//                         <p key={this.dataToExport[key]['s'] + 'change'}>{this.dataToExport[key]['change']}</p>
//                     </div>
//                 )

//             })

//             ReactDOM.render(template, app);

//             let container = document.querySelectorAll('.container');
//             let paragraph = document.querySelectorAll('.container p')

//             for (let i = 0; i < paragraph.length; i++) {
//                 if (Number(paragraph[i].innerHTML) >= .9) {
//                     container[i].classList.add('alert');
//                 } else if (Number(paragraph[i].innerHTML) > 0) {
//                     container[i].classList.remove('hide');
//                     container[i].classList.remove('alert');

//                 } else {
//                     container[i].classList.add('hide')
//                     container[i].classList.remove('alert');

//                 }
//             }