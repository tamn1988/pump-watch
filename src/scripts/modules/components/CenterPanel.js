import React from 'react';
import CoinChart from './CoinChart';
import ChangeDisplay from './ChangeDisplay';
import CurrentFilters from './CurrentFilters'
import MedianBar from './MedianBar';


const CenterPanel = (props) => {
    return (
        <div className="center-panel">
            <div className="center-panel__title">
                Price Chart
            </div>

            <div className='chart'>
                <CoinChart
                    trades={props.tradeHistory}
                    chartData={props.chartData}
                />
            </div>

            <MedianBar
                trades={props.tradeHistory}
                reset={props.reset}
                handleChange={props.handleChange}
                handleChangeVolume={props.handleChangeVolume}
            />

            <div className="change">
                <CurrentFilters filters={props.filters} />
                <ChangeDisplay
                    altcoins={props.altcoins}
                    handleGetData={props.handleGetData}
                    alertHandle={props.alertHandle}
                    filters={props.filters}
                />
            </div>
        </div>
    )
}

export default CenterPanel;




// <div className='chart__bottom-bar'>
// <h2 className='chart__price'>{this.props.trades && this.props.trades[0].price}</h2>
// </div>