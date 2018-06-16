import React from 'react'

export default class TradeHistory extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.trades !== this.props.trades
    }

    tradeHistoryTextColor(initial, index){
        if (index === this.props.trades.length-1){
            index = this.props.trades.length - 2;
        }
        if (initial >= this.props.trades[index + 1].price){
            return 'trade-history__price trade-history__price--green'
        }
        return 'trade-history__price trade-history__price--red'
    }

    render() {
        if (this.props.trades[0].price !== 'Pending') {
            return this.props.trades.map((item,i) => {
                return (
                    <div className='trade-history' key={item.id}>
                        <div className={this.tradeHistoryTextColor(item.price, i)} key={item.id + "price"}>{item.price + " "}</div>
                        <div className='trade-history__qty' key={item.id + "qty"}>{item.qty + " "}</div>
                        <div className='trade-history__time' key={item.id + "time"}>{item.time + " "}</div>
                    </div>
                )
            })
        }
        return <div>Waiting on Binance API...</div>
    }

}