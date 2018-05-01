import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import ChartData from '../scripts/modules/ChartData.js'
import TradeData from '../scripts/modules/TradeData.js'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import '../styles/styles.css';

const dataStream = new HandleData();
const alert = new Alert();
const app = document.getElementById('app');
const getChartData = new ChartData();
const getTradeData = new TradeData();

class CryptoviewerApp extends React.Component {
    constructor(props) {
        super(props);
        this.populateState = this.populateState.bind(this);
        this.callChartData = this.callChartData.bind(this);
        this.handleGetChart = this.handleGetChart.bind(this);
        this.coin;
        this.tradeHistoryTimer;
        this.populateState();
        this.state = {
            pinned: [],
        }
    }

    populateState() {
        setInterval(() => {
            this.setState(() => {
                return {
                    altcoins: dataStream.dataToExport,
                }
            })
        }, 400)
    }

    handleGetChart(e) {
        clearInterval(this.tradeHistoryTimer);
        this.coin = e.target.getAttribute('coin-name');
        getChartData.fetchData(this.coin);
        this.callChartData();
        this.tradeHistoryTimer = setInterval(()=>{
            getTradeData.fetchData(this.coin);
            this.callTradeData();
        }, 1500)
    }

    callTradeData() {
        setTimeout(() => {
            this.setState(() => {
                return {
                    tradeHistory: getTradeData.dataOut
                }
            })
        }, 1000)
    }

    callChartData() {
        setTimeout(() => {
            this.setState(() => {
                return {
                    chartData: getChartData.formattedData
                }
            })
        }, 1000)
    }

    render() {
        return (
            <div>
                <div className="flex flex--justify-center wrapper">
                    <div className="header">
                        &nbsp;
                    </div>
                    <div className="left-panel">
                        &nbsp;
                    </div>
                    <div className="center-panel">
                        <div className='chart'>
                            <CoinChart
                                chartData={this.state.chartData}
                            />
                        </div>
                        <div className="change">
                            <ChangeDisplay
                                altcoins={this.state.altcoins}
                                handleGetChart={this.handleGetChart}
                            />
                        </div>
                    </div>
                    <div className="right-panel">
                        <TradeHistory trades={this.state.tradeHistory} />
                    </div>
                </div>
            </div>
        )
    }
}

const ChangeDisplay = (props) => {
    if (props.altcoins) {
        return Object.keys(props.altcoins).map((key, i) => {
            return (
                <div className={alert.alertStyle(props.altcoins[key])} key={props.altcoins[key]['s']}>
                    <h4 className='change__title' key={props.altcoins[key]['s'] + 'name'}>{props.altcoins[key]['s']}</h4>
                    <p className='change__price' key={props.altcoins[key]['s'] + 'change'}>{props.altcoins[key]['change'] + "%"}</p>
                    <a href="#" key={props.altcoins[key]['s'] + 'link'} className='change__link' onClick={props.handleGetChart} coin-name={props.altcoins[key]['s']}></a>
                </div>

            )
        })
    }
    return <div>Waiting...</div>
}

const CoinChart = (props) => {
    if (props.chartData)
        return (
            <LineChart width={600} height={300} data={props.chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }} animationDuration={300}>
                <Line type="monotone" dataKey="close" stroke="#9ad76b" strokeWidth={2} dot={false} />
                <XAxis dataKey="name" hide={true} />
                <YAxis type="number" hide={true} domain={['dataMin', 'dataMax']} />
            </LineChart>
        )
    return <div></div>
}

const TradeHistory = (props) => {
    if (props.trades) {
        return props.trades.map((item) => {
            return (
                <div className='trade-history' key={item.id}>
                    <span className='trade-history__price' key={item.id + "price"}>{item.price + " "}</span>
                    <span className='trade-history__qty' key={item.id + "qty"}>{item.qty + " "}</span>
                    <span className='trade-history__time' key={item.id + "time"}>{item.time + " "}</span>
                </div>
            )
        })
    }
    return <div></div>
}

ReactDOM.render(<CryptoviewerApp />, app)
