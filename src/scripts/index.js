import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import ChartData from '../scripts/modules/ChartData.js'
import TradeData from '../scripts/modules/TradeData.js'
import BookData from '../scripts/modules/BookData.js'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import '../styles/styles.css';
import { SSL_OP_PKCS1_CHECK_2 } from 'constants';

const dataStream = new HandleData();
const alert = new Alert();
const app = document.getElementById('app');
const getChartData = new ChartData();
const getTradeData = new TradeData();
const getBookData = new BookData();

class CryptoviewerApp extends React.Component {
    constructor(props) {
        super(props);
        this.populateState = this.populateState.bind(this);
        this.callChartData = this.callChartData.bind(this);
        this.handleGetChart = this.handleGetChart.bind(this);
        this.initialize = this.initialize.bind(this);
        this.coin;
        this.tradeHistoryTimer;
        this.bookDataTimer;
        this.populateState();
        this.initialize();
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

    initialize() {
        this.coin = "BTCUSDT";

        this.tradeHistoryTimer = setInterval(() => {
            getTradeData.fetchData(this.coin);
            this.callTradeData();
        }, 1000)

        this.bookDataTimer = setInterval(() => {
            getBookData.fetchData(this.coin);
            this.callBookData();
        }, 1000)

        setTimeout(() => {
            getChartData.fetchData(this.coin);
            this.callChartData();
        }, 2000)

    }

    handleGetChart(e) {

        clearInterval(this.tradeHistoryTimer);
        clearInterval(this.bookDataTimer);

        this.coin = e.target.getAttribute('coin-name');


        this.tradeHistoryTimer = setInterval(() => {
            getTradeData.fetchData(this.coin);
            this.callTradeData();
        }, 1000)

        this.bookDataTimer = setInterval(() => {
            getBookData.fetchData(this.coin);
            this.callBookData();
        }, 1000)

        getChartData.fetchData(this.coin);
        this.callChartData();

    }

    callBookData() {
        setTimeout(() => {
            this.setState(() => {
                return {
                    marketBook: getBookData.dataOut
                }
            })
        }, 1000)
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
                        <div className="order-book">
                            <div className="order-book__ask__container" >
                                <MarketBookAsks orderBook={this.state.marketBook} />
                            </div>
                            <div className="order-book__median">
                                <h4>{this.coin}</h4>
                            </div>
                            <div className="order-book__bid__container">
                                <MarketBookBids orderBook={this.state.marketBook} />
                            </div>
                        </div>
                    </div>
                    <div className="center-panel">
                        <div className='chart'>
                            <CoinChart
                                trades={this.state.tradeHistory}
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
                        <div className='trade-history__bar'>
                            <span>Price</span>
                            <span>Amount</span>
                            <span>Time</span>
                        </div>
                        <div className="trade-history__container">
                            <TradeHistory trades={this.state.tradeHistory} />
                        </div>

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
    return <div>Connecting...</div>
}

const CoinChart = (props) => {
    if (props.chartData)
        return (
            <div className='chart__container'>
                <h2 className='chart__price'>{props.trades[0].price}</h2>
                <LineChart width={600} height={300} data={props.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }} animationDuration={300}>
                    <Line type="monotone" dataKey="close" stroke="#9ad76b" strokeWidth={2} dot={false} />
                    <XAxis dataKey="name" hide={true} />
                    <YAxis type="number" hide={true} domain={['dataMin', 'dataMax']} />
                </LineChart>
            </div>

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

const MarketBookBids = (props) => {
    if (props.orderBook) {
        return props.orderBook.bids.map((item) => {
            return (
                <div key={item.price} className='order-book__bid'>
                    <span key={item.price + 'price'} className='order-book__bid--price'>{item.price + ' '}</span>
                    <span key={item.price + 'amount'} className='order-book__bid--amount'>{item.amount + ' '}</span>
                </div>
            )
        })
    }
    return null
}

const MarketBookAsks = (props) => {
    if (props.orderBook) {
        return props.orderBook.asks.map((item) => {
            return (
                <div key={item.price} className='order-book__ask'>
                    <span key={item.price + 'price'} className='order-book__ask--price'>{item.price + ' '}</span>
                    <span key={item.price + 'amount'} className='order-book__ask--amount'>{item.amount + ' '}</span>
                </div>
            )
        })
    }
    return null
}

ReactDOM.render(<CryptoviewerApp />, app)
