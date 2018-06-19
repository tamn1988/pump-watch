import React from 'react';

const CurrentFilters = (props)=>{
    return (
        <div className='current-filters wrapper'>
            <p>Current Filter: <span className='current-filters__text'>{props.filters && props.filters.name} </span>Min Volume: <span className='current-filters__text'>{props.filters && props.filters.volume}</span></p>
        </div>
    )
}
export default CurrentFilters;