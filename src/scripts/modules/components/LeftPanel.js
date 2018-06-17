import React from 'react';
import MarketBookAsks from './MarketBookAsks';
import MarketBookBids from './MarketBookBids';

const LeftPanel = (props) => {
    return (
        <section className="left-panel">
            <div className="left-panel__title">
                Order Book
            </div>
            <div className="order-book">
                <div className="order-book__ask__container" >
                    <MarketBookAsks orderBook={props.orderBook} />
                </div>
                <div className="order-book__median">
                    <p className='order-book__median__info'>{props.currentCoin}</p>
                </div>
                <div className="order-book__bid__container">
                    <MarketBookBids orderBook={props.orderBook} />
                </div>
            </div>
        </section>
    )
}

export default LeftPanel;