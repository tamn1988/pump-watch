import React from 'react';


export default class MarketBookBids extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.orderBook !== this.props.orderBook
    }

    render() {
        if (this.props.orderBook) {
            return this.props.orderBook.bids.map((item) => {
                return (
                    <div key={item.price} className='order-book__bid'>
                        <span key={item.price + 'price'} className='order-book__bid--price'>{item.price + ' '}</span>
                        <span key={item.price + 'amount'} className='order-book__bid--amount'>{item.amount + ' '}</span>
                    </div>
                )
            })
        }
        return <div>Waiting on Binance API...</div>
    }

}