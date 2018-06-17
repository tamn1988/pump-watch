import React from 'react';
import AlertTicker from  './AlertTicker';


const Footer = (props) => {
    return (
        <div className="alert-ticker">
            <div className="alert-ticker__container">
                <div className="alert-ticker__slide">
                    <span className="alert-ticker__title">ALERTS: <AlertTicker handleGetData={props.handleGetData}
                        pinned={props.pinned} /></span>
                </div>
            </div>
            <div className="footer">
                Copyright Tam Nguyen 2018
            </div>
        </div>
    )
}


export default Footer;