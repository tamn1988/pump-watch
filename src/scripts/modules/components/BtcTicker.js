import React from 'react';

const BtcTicker = (props) => {
    if (props.altcoins) {
        return (
            <p className='header__btc-ticker'>BTC Price:
             {props.altcoins.BTCUSDT.current ? Math.round(props.altcoins.BTCUSDT.current) : 'Waiting'}
            </p>
        )
    }
    return <div>Waiting on Binance API...</div>
}

export default BtcTicker;