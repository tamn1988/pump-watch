import React from 'react';

export default class CorsCheck extends React.Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state={
            cors: false,
        }
    }

    handleChange(e){
        let value = e.target.value
        this.setState({cors: value})
        this.props.handleChangeCors(value);
    }

    render(){
        return (
            <form className='flex flex--aligni-center flex--justify-end'>
                <label>
                    <input type="radio" checked={this.state.cors === 'no'} value={'no'} onChange={this.handleChange}/>
                    No Cors Extension
                </label>
                <label>
                    <input type="radio" checked={this.state.cors === 'yes'} value={'yes'} onChange={this.handleChange}/>
                    Cors Extension
                </label>
            </form>
        )
    }
}






