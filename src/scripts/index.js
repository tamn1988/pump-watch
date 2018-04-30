import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import Alert from '../scripts/modules/AlertToggle.js'
import ChartData from '../scripts/modules/ChartData.js'
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import '../styles/styles.css';

const dataStream = new HandleData();
const alert = new Alert();
const app = document.getElementById('app');
let getChartData = new ChartData();

class CryptoviewerApp extends React.Component {
    constructor(props) {
        super(props);
        this.populateState = this.populateState.bind(this);
        this.callChartData = this.callChartData.bind(this);
        this.handleGetChart = this.handleGetChart.bind(this);
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
        }, 1000)
    }

    handleGetChart(e) {
        let coin = e.target.getAttribute('coin-name');
        getChartData.fetchData(coin)
        this.callChartData();
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
                <div className="flex wrapper">
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
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>>
                <Line type="monotone" dataKey="close" stroke="#9ad76b" dot={false} />
                <XAxis dataKey="name" hide={true} />
                <YAxis type="number" hide={true} domain={['dataMin', 'dataMax']} />
            </LineChart>
        )
    return <div></div>
}

ReactDOM.render(<CryptoviewerApp />, app)
