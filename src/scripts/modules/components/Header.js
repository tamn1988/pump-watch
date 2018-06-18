import React from 'react';
import BtcTicker from './BtcTicker';
import CorsCheck from './CorsCheck';

const Header = (props) => {
    return (
        <div className="header">
            <div className="wrapper">
                <div className="header__top-bar">
                    <div className="header--logo__container">
                        <div className='header--logo-top'>Pump</div>
                        <div className="header--logo-bottom">Watch&#8599;</div>
                    </div>
                    <div className="header__btc-ticker">
                        <BtcTicker altcoins={props.altcoins} />
                    </div>
                    <CorsCheck handleChangeCors={props.handleChangeCors} />
                </div>
            </div>
        </div>
    )
}

export default Header