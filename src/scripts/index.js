import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/styles.css';


const app = document.getElementById('app');
const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

let startingData;

socket.addEventListener('message', ((event) => {

    if (!startingData) {
        initialData(event);
        startingData = arrayToObject(startingData);

    }
    let filteredData = JSON.parse(event.data).filter((currency) => {
        return currency.s.indexOf('BTC') !== -1;
    })
    filteredData.map((currency) => {
        if (!startingData[currency.s]) {
            startingData[currency.s] = currency;
        }
        startingData[currency.s]["change"] = round((((currency.c - startingData[currency.s]['c']) / startingData[currency.s]['c']) * 100), 2)
    })

    let template = Object.keys(startingData).map((key,i) => {
        return (
            <div className="container" key={startingData[key]['s']}>
                <h3 key={startingData[key]['s'] + 'name'}>{startingData[key]['s']}</h3>
                <p key={startingData[key]['s'] + 'change'}>{startingData[key]['change']}</p>
            </div>
        )
        
    })

    ReactDOM.render(template, app);

    let container = document.querySelectorAll('.container');
    let paragraph = document.querySelectorAll('.container p')
    
for (let i = 0; i < paragraph.length; i++){
    if (Number(paragraph[i].innerHTML) <  0){
        container[i].classList.add('hide');
    } else if (Number(paragraph[i].innerHTML) >  0){
        container[i].classList.remove('hide');
    }
}

}))

const initialData = (data) => {
    if (!startingData) {
        startingData = JSON.parse(data.data).filter((currency) => {
            return currency.s.indexOf('BTC') !== -1;
        })
    }
}

const arrayToObject = (array) =>
    array.reduce((obj, item) => {
        obj[item.s] = item
        return obj
    }, {})


const round = (num, places)=>{
    let multiplier = Math.pow(10, places);
    return Math.round(num*multiplier) / multiplier;
}





