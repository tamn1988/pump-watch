import React from 'react';

export default class ChangeDisplay extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        //Filtered altcoins this.state.filters.name
        const filtered = Object.keys(this.props.altcoins).reduce((acc, key)=>{
            if (key.indexOf(this.props.filters.name) !== -1 && this.props.altcoins[key].q >= this.props.filters.volume){
                acc[key] = this.props.altcoins[key];
            }
            return acc
        }, {});

        if (filtered) {
            return Object.keys(filtered).map((key) => {
                return (
                    <div className={this.props.alertHandle.alertStyle(filtered[key])} key={filtered[key]['s']}>
                        <h4 className='change__title' key={filtered[key]['s'] + 'name'}>{filtered[key]['s']}</h4>
                        <p className='change__price' key={filtered[key]['s'] + 'change'}>{filtered[key]['change'] + "%"}</p>
                        <a href="#" key={filtered[key]['s'] + 'link'} className='change__link' onClick={this.props.handleGetData} coin-name={filtered[key]['s']}></a>
                    </div>
                )
            })
        }
        return <div>Connecting...</div>
    }
}







