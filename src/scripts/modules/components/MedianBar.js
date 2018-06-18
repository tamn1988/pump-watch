import React from 'react';

export default class MedianBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let input = parseFloat(this.input.value);

        if (input <= 0) {
            console.log(typeof input)
            alert('Needs to be a number greater than 0')
            return false;
        }

        //Change reset interval from reset method inside HandleData.js
        this.props.reset(input);
        this.input.value = '';

    }

    render() {
        return (
            <div className='median-bar'>
                <div className="flex flex--justify-center flex--full-h flex--aligni-center">
                    <div className="median-bar__left-container">
                        <form onSubmit={this.handleSubmit}>
                            <input className='median-bar__interval-input' type="number" step='.01' placeholder='Watch duration in minutes' ref={(input) => this.input = input} />
                        </form>
                    </div>
                    <div className="median-bar__center-container">
                        <h2 className='median-bar__price'>{this.props.trades && this.props.trades[0].price}</h2>
                    </div>
                    <div className="median-bar__right-container">
                        <form>
                            <input className='median-bar__interval-input' type="text" placeholder='Search Coin' onChange={this.props.handleChange} />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
