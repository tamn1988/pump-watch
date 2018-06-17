import React from 'react';
import TradeHistory from './TradeHistory';


const RightPanel = (props) => {
    return (
        <div className="right-panel">
            <div className="right-panel__title">
                Trade
            </div>
            <div className='trade-history__bar'>
                <span>Price</span>
                <span>Amount</span>
                <span>Time</span>
            </div>
            <div className="trade-history__container">
                <TradeHistory trades={props.tradeHistory} />
            </div>
        </div>
    )
}

export default RightPanel