import React from 'react';

export default class CorsCheck extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            cors: 'no'
        }
    }

    handleChange(e) {
        let value = e.target.value
        this.setState({ cors: value })
        this.props.handleChangeCors(value);
    }

    render() {
        return (
            <form className='flex flex--aligni-center flex--justify-end cors-form'>
                <label>
                    <input type="radio" checked={this.state.cors === 'no'} value={'no'} onChange={this.handleChange} />
                    No Extension
                </label>
                <label>
                    <input type="radio" checked={this.state.cors === 'yes'} value={'yes'} onChange={this.handleChange} />
                    Cors Extension
                </label>
            </form>
        )
    }
}






