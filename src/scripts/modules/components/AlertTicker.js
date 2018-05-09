import React from 'react';

const AlertTicker = (props) => {
    if (props.pinned) {
        return props.pinned.map((item) => {
            return <a href="#" key={item + 'ticker'} className='alert-ticker__item' coin-name={item} onClick={props.handleGetData}>{item + " "}</a>
        })
    }
    return null
}

export default AlertTicker;