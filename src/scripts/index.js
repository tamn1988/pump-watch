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
    let container = document.querySelectorAll('.container');
    let paragraph = document.querySelectorAll('.container p')
    const alertSound = () => {
        const audio = new Audio('../src/alert.mp3');
        audio.loop = false;
        audio.play();
    }

    for (let i = 0; i < paragraph.length; i++) {
        if (Number(paragraph[i].innerHTML) >= .9) {
            alertSound();
            container[i].classList.add('alert');
        } else if (Number(paragraph[i].innerHTML) > 0) {
            container[i].classList.remove('hide');
            container[i].classList.remove('alert');

        } else {
            container[i].classList.add('hide')
            container[i].classList.remove('alert');

        }
    }
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
