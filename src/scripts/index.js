import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import ChartData from '../scripts/modules/ChartData.js'
import TradeData from '../scripts/modules/TradeData.js'
import BookData from '../scripts/modules/BookData.js'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import '../styles/styles.css';

const dataStream = new HandleData();
const alertHandle = new Alert();
const app = document.getElementById('app');
const getChartData = new ChartData();
const getTradeData = new TradeData();
const getBookData = new BookData();

if (/Mobi/.test(navigator.userAgent)) {
    alert('This app is in beta, and currently only supports desktop browsers');
}

class CryptoviewerApp extends React.Component {
    constructor(props) {
        super(props);
        this.populateState = this.populateState.bind(this);
        this.getRestAPIData = this.getRestAPIData.bind(this);
        this.handleGetData = this.handleGetData.bind(this);
        this.setStateRestAPI = this.setStateRestAPI.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);
        this.coin;
        this.altCoinRestInterval;
        this.state = {
            currentCoin: 'BTCUSDT'
        }
    }

    populateState() {
        setInterval(() => {
            this.setState(() => {
                return {
                    altcoins: dataStream.dataToExport,
                    pinned: alertHandle.pinned
                }
            })
        }, 400)
    }

    handleGetData(e) {
        clearInterval(this.altCoinRestInterval);
        let coin = e.target.getAttribute('coin-name');
        this.setState(() => {
            return {
                currentCoin: coin
            }
        })
    }

    componentDidMount() {
        this.populateState();
        this.getRestAPIData(this.state.currentCoin)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentCoin !== this.state.currentCoin) {
            this.getRestAPIData(this.state.currentCoin)
        }
    }



    getRestAPIData(coin) {
        setTimeout(() => {
            getTradeData.fetchData(coin);
            getBookData.fetchData(coin);
            getChartData.fetchData(coin);
            this.setStateRestAPI();
        }, 1000)


        this.altCoinRestInterval = setInterval(() => {
            getTradeData.fetchData(coin);
            getBookData.fetchData(coin);
            getChartData.fetchData(coin);
            this.setStateRestAPI();
        }, 3000)
    }


    setStateRestAPI() {
        setTimeout(() => {
            this.setState(() => {
                return {
                    marketBook: getBookData.dataOut,
                    tradeHistory: getTradeData.dataOut,
                    chartData: getChartData.formattedData
                }
            })
        }, 0)
    }

    roundToTwo(num, places) {
        let multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }

    render() {
        return (
            <div>
                <div className="header">
                    <div className="wrapper">
                        <div className="header__top-bar">
                            <div className="header--logo__container">
                                <div className='header--logo-top'>Pump</div>
                                <div className="header--logo-bottom">Watch&#8599;</div>
                            </div>
                            <div className="header__btc-ticker">
                                <BtcTicker altcoins={this.state.altcoins} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex--justify-center wrapper">
                    <div className="header__bottom-bar wrapper">
                        <div className='header__bottom-bar--book'>Order Book</div>
                        <div className='header__bottom-bar--chart'>Price Chart</div>
                        <div className='header__bottom-bar--history'>Trade History</div>
                    </div>
                    <div className="left-panel">
                        <div className="order-book">
                            <div className="order-book__ask__container" >
                                <MarketBookAsks orderBook={this.state.marketBook} />
                            </div>
                            <div className="order-book__median">
                                <p className='order-book__median__info'>{this.state.currentCoin}</p>
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
                                handleGetData={this.handleGetData}
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
                <div className="alert-ticker">
                    <div className="alert-ticker__container">
                        <div className="alert-ticker__slide">
                            <span className="alert-ticker__title">ALERTS: <AlertTicker handleGetData={this.handleGetData}
                                pinned={this.state.pinned} /></span>
                        </div>
                    </div>
                    <div className="footer">
                        Copyright Tam Nguyen 2018
                    </div>
                </div>
            </div>
        )
    }
}

const AlertTicker = (props) => {
    if (props.pinned) {
        return props.pinned.map((item) => {
            return <a href="#" key={item + 'ticker'} className='alert-ticker__item' coin-name={item} onClick={props.handleGetData}>{item + " "}</a>
        })
    }
    return null
}

const ChangeDisplay = (props) => {
    if (props.altcoins) {
        return Object.keys(props.altcoins).map((key, i) => {
            return (
                <div className={alertHandle.alertStyle(props.altcoins[key])} key={props.altcoins[key]['s']}>
                    <h4 className='change__title' key={props.altcoins[key]['s'] + 'name'}>{props.altcoins[key]['s']}</h4>
                    <p className='change__price' key={props.altcoins[key]['s'] + 'change'}>{props.altcoins[key]['change'] + "%"}</p>
                    <a href="#" key={props.altcoins[key]['s'] + 'link'} className='change__link' onClick={props.handleGetData} coin-name={props.altcoins[key]['s']}></a>
                </div>

            )
        })
    }
    return <div>Connecting...</div>
}

class CoinChart extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.chartData !== this.props.chartData
    }

    render() {
        if (this.props.chartData) {
            return (
                <div className='chart__container'>
                    <LineChart width={840} height={260} data={this.props.chartData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }} animationDuration={300}>
                        <Line type="monotone" dataKey="close" stroke="#9ad76b" strokeWidth={2} dot={false} />
                        <XAxis dataKey="name" hide={true} />
                        <YAxis type="number" padding={{ right: 20 }} tick={{ fontSize: ".8rem" }} axisLine={false} width={60} orientation='right' domain={['dataMin', 'dataMax']} />
                    </LineChart>
                    <div className='chart__bottom-bar'>
                        <h2 className='chart__price'>{this.props.trades[0].price}</h2>
                    </div>
                </div>

            )
        }
        return <div>Waiting on Binance API...</div>

    }
}

const BtcTicker = (props) => {
    if (props.altcoins) {
        return (
            <p className='header__btc-ticker'>BTC Price: {Math.round(props.altcoins.BTCUSDT.current) + " USDT"}</p>
        )
    }
    return <div>Waiting on Binance API...</div>
}


class TradeHistory extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.trades !== this.props.trades
    }
    render() {
        if (this.props.trades) {
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

class MarketBookBids extends React.Component {
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

class MarketBookAsks extends React.Component{
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

ReactDOM.render(<CryptoviewerApp />, app)
