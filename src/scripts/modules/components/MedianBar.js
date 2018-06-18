import React from 'react';

export default class MedianBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            timer: "Set Value in Minutes"
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let input = parseFloat(this.input.value);
        console.log(input)

        if (!input || input <= 0) {
            console.log(typeof input)
            alert('Needs to be a number greater than 0')
            return false;
        }
        this.setState(({timer:input}));
        //Change reset interval from reset method inside HandleData.js
        this.props.reset(input);
        this.input.value = '';

    }

    render() {
        return (
            <div className='median-bar'>
                <div className="flex flex--justify-center flex--full-h flex--aligni-center">
                    <div className="median-bar__left-container flex flex--no-wrap flex--aligni-center">
                        <form onSubmit={this.handleSubmit}>
                        <input className='median-bar__input median-bar__input--medium' type="number" step='.01' placeholder="Duration" ref={(input) => this.input = input} />
                        </form>
                        <p className='median-bar__duration'>Duration: {this.state.timer}</p>
                    </div>
                    <div className="median-bar__center-container">
                        <h2 className='median-bar__price'>{this.props.trades && this.props.trades[0].price}</h2>

                    </div>
                    <div className="median-bar__right-container">
                        <form className='flex flex--no-wrap'>
                            <input className='median-bar__input median-bar__input--small' type="text" placeholder='Filter Coin' onChange={this.props.handleChange} />
                            <input className='median-bar__input median-bar__input--small' step='1' type="number" placeholder='Min Volume' onChange={this.props.handleChangeVolume} />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
