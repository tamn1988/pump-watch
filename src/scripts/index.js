import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import MarketBookAsks from '../scripts/modules/components/MarketBookAsks'
import MarketBookBids from '../scripts/modules/components/MarketBookBids'
import TradeHistory from '../scripts/modules/components/TradeHistory'
import CoinChart from '../scripts/modules/components/CoinChart'
import AlertTicker from '../scripts/modules/components/AlertTicker'
import Header from '../scripts/modules/components/Header'
import ChangeDisplay from '../scripts/modules/components/ChangeDisplay'
import {convertDataChart, convertDataBook, convertDataTrade, buildApiLinks} from '../scripts/modules/formatRestData'
import '../styles/styles.css';

const dataStream = new HandleData();
const alertHandle = new Alert();
const app = document.getElementById('app');

if (/Mobi/.test(navigator.userAgent)) {
    alert('This app is in beta, and currently only supports desktop browsers');
}

class CryptoviewerApp extends React.Component {
    constructor(props) {
        super(props);
        this.populateState = this.populateState.bind(this);
        this.getRestAPIData = this.getRestAPIData.bind(this);
        this.handleGetData = this.handleGetData.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.alertHandle = alertHandle;
        this.coin;
        this.altCoinRestInterval;
        this.state = {
            currentCoin: 'BTCUSDT',
            altcoins: {
                BTCUSDT: {
                    current: 'Pending',
                    change: 'Pending',
                    s: 'BTCUSDT'
                }
            },
            tradeHistory:[
                {
                    price: 'Pending',
                    amount: 'Pending',
                    id: 0
                }
            ]
        }
    }

    fetchData(coinAPI, func, stateName) {
    fetch(coinAPI)
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((response) => {
            this.setState(()=>{
                return {
                    [stateName]: func(response)
                }
            })
        })
        .catch((error) => {
            console.log(error)
        })
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
        let link = buildApiLinks(coin)

        this.altCoinRestInterval = setInterval(() => {
            this.fetchData(link.chartAPI, convertDataChart, 'chartData')
            this.fetchData(link.tradeAPI, convertDataTrade, 'tradeHistory')
            this.fetchData(link.bookAPI, convertDataBook, 'marketBook')
            
        }, 3000)
    }

    roundToTwo(num, places) {
        let multiplier = Math.pow(10, places);
        return Math.round(num * multiplier) / multiplier;
    }

    render() {
        return ( 
            <div>
                <Header altcoins={this.state.altcoins} />
                <div className="flex flex--justify-center wrapper">
                    <div className="left-panel">
                        <div className="left-panel__title">
                            Order Book
                        </div>
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
                        <div className="center-panel__title">
                            Price Chart
                    </div>
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
                        <div className="right-panel__title">
                            Trade
                    </div>
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