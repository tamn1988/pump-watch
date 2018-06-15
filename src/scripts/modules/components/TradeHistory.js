import React from 'react'

export default class TradeHistory extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.trades !== this.props.trades
    }
    render() {
        if (this.props.trades[0].price !== 'Pending') {
            return this.props.trades.map((item) => {
                return (
                    <div className='trade-history' key={item.id}>
                        <div className='trade-history__price' key={item.id + "price"}>{item.price + " "}</div>
                        <div className='trade-history__qty' key={item.id + "qty"}>{item.qty + " "}</div>
                        <div className='trade-history__time' key={item.id + "time"}>{item.time + " "}</div>
                    </div>
                )
            })
        }
        return <div>Waiting on Binance API...</div>
    }

}