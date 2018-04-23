import React from 'react';
import ReactDOM from 'react-dom';

const app = document.getElementById('app');

const socket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

socket.addEventListener('message', ((event) => {
    let render = () => {
        let data = JSON.parse(event.data);
        data = data.filter((currency)=>{
            return currency.s.indexOf('BTC') !== -1;
        }) 
        let template = data.map( (item)=>{
            return (
                <div key={item.s}>
                    <h3 key={item.s + "name"}>{item.s}</h3>
                    <p key={item.s + "price"}>{item.c}</p>
                </div>
            )
        })
        ReactDOM.render(template, app);
    }
    render();
}))









