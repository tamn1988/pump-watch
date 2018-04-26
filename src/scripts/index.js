import React from 'react';
import ReactDOM from 'react-dom';
import HandleData from '../scripts/modules/HandleData.js'
import '../styles/styles.css';

const test = new HandleData();
setInterval( ()=>{
    console.log(test.dataToExport);
}, 1000)

