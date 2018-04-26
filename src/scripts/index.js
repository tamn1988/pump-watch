import React from 'react'
import ReactDOM from 'react-dom'
import HandleData from '../scripts/modules/HandleData.js'
import '../styles/styles.css';

const dataStream = new HandleData();
const app = document.getElementById('app');

class CryptoviewerApp extends React.Component {
    constructor(props) {
        super(props);
        this.populateState = this.populateState.bind(this);
        this.populateState();
        this.state = {

        }
    }

    populateState() {
        setInterval(() => {
            this.setState(() => {
                return {
                    altcoins: dataStream.dataToExport
                }
            })
        }, 1000)
    }

    render() {
        return (
            <div>
                <Change altcoins={this.state.altcoins} />
            </div>
        )
    }
}

const Change = (props) => {
    if (props.altcoins) {
        return Object.keys(props.altcoins).map((key, i) => {
            return (
                <div className="container" key={props.altcoins[key]['s']}>
                    <h3 key={props.altcoins[key]['s'] + 'name'}>{props.altcoins[key]['s']}</h3>
                    <p key={props.altcoins[key]['s'] + 'change'}>{props.altcoins[key]['change']}</p>
                </div>
            )
        })
    }
    return <div>Waiting...</div>
}
ReactDOM.render(<CryptoviewerApp />, app)





