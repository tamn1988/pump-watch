import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import ChartData from '../scripts/modules/ChartData.js'
import TradeData from '../scripts/modules/TradeData.js'
import BookData from '../scripts/modules/BookData.js'
import MarketBookAsks from '../scripts/modules/components/MarketBookAsks'
import MarketBookBids from '../scripts/modules/components/MarketBookBids'
import TradeHistory from '../scripts/modules/components/TradeHistory'
import CoinChart from '../scripts/modules/components/CoinChart'
import AlertTicker from '../scripts/modules/components/AlertTicker'
import BtcTicker from '../scripts/modules/components/BtcTicker'
import ChangeDisplay from '../scripts/modules/components/ChangeDisplay'
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
        this.alertHandle = alertHandle;
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
                                alertHandle={this.alertHandle}
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

ReactDOM.render(<CryptoviewerApp />, app)
