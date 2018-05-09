import React from 'react';

export default class MarketBookAsks extends React.Component{
    constructor(props){
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.orderBook !== this.props.orderBook
    }  

    render(){
        if (this.props.orderBook) {
            return this.props.orderBook.asks.map((item) => {
                return (
                    <div key={item.price} className='order-book__ask'>
                        <span key={item.price + 'price'} className='order-book__ask--price'>{item.price + ' '}</span>
                        <span key={item.price + 'amount'} className='order-book__ask--amount'>{item.amount + ' '}</span>
                    </div>
                )
            })
        }
        return <div>Waiting on Binance API...</div>
    }
}