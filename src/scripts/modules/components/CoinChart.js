import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'


export default class CoinChart extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.chartData !== this.props.chartData
    }

    render() {
        if (this.props.chartData) {
            return (
                <div className='chart__container' >
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={this.props.chartData}
                            margin={{ top: 40, right: 30, left: 20, bottom: 10 }} animationDuration={300}>
                            <Line type="monotone" dataKey="close" stroke="#9ad76b" strokeWidth={2} dot={false} />
                            <XAxis dataKey="name" hide={true} />
                            <YAxis type="number" padding={{ right: 20 }} tick={{ fontSize: ".8rem" }} axisLine={false} width={60} orientation='right' domain={['dataMin', 'dataMax']} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className='chart__bottom-bar'>
                        <h2 className='chart__price'>{this.props.trades[0].price}</h2>
                    </div>
                </div>

            )
        }
        return <div>Waiting on Binance API...</div>

    }
}