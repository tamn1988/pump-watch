import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import LeftPanel from '../scripts/modules/components/LeftPanel'
import RightPanel from '../scripts/modules/components/RightPanel'
import CenterPanel from '../scripts/modules/components/CenterPanel'
import Footer from '../scripts/modules/components/Footer'
import Header from '../scripts/modules/components/Header'
import { convertDataChart, convertDataBook, convertDataTrade, buildApiLinks } from '../scripts/modules/formatRestData'
import '../styles/styles.css';

// const dataStream = new HandleData();
// const alertHandle = new Alert();
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
        this.handleChange = this.handleChange.bind(this);
        this.roundToTwo = this.roundToTwo.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.alertHandle = new Alert();
        this.dataStream = new HandleData();
        this.coin;
        this.altCoinRestInterval;
        this.state = {
            filters: {
                name: 'BTC',
                pair: 'BTC',
                volume: 0
            },
            currentCoin: 'BTCUSDT',
            altcoins: {
                BTCUSDT: {
                    current: 'Pending',
                    change: 'Pending',
                    s: 'BTCUSDT'
                }
            },
            tradeHistory: [
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
                this.setState(() => {
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
                    altcoins: this.dataStream.dataToExport,
                    pinned: this.alertHandle.pinned
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

    handleChange(e) {
        const search = e.target.value.toUpperCase()
        this.setState((prevState)=>{
            return {
                filters: {
                    ...prevState.filters,
                    name: search
                }
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
        this.fetchData(link.chartAPI, convertDataChart, 'chartData')
        this.fetchData(link.tradeAPI, convertDataTrade, 'tradeHistory')
        this.fetchData(link.bookAPI, convertDataBook, 'marketBook')

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
                    <LeftPanel orderBook={this.state.marketBook} currentCoin={this.state.currentCoin} />
                    <CenterPanel
                        altcoins={this.state.altcoins}
                        handleGetData={this.handleGetData}
                        alertHandle={this.alertHandle}
                        tradeHistory={this.state.tradeHistory}
                        chartData={this.state.chartData}
                        reset={this.dataStream.reset}
                        handleChange={this.handleChange}
                        filters={this.state.filters}
                    />
                    <RightPanel tradeHistory={this.state.tradeHistory} />
                </div>
                <Footer handleGetData={this.handleGetData} pinned={this.state.pinned} />
            </div>
        )
    }
}

ReactDOM.render(<CryptoviewerApp />, app)