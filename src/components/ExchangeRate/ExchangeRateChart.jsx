import React, { useEffect, useRef } from 'react';
import styles from './ExchangeRate.module.css';
import Chart from 'chart.js/auto';

const ExchangeRateChart = ({ history, currency, width = '700%', height = '300%' }) => {
   const chartRef = useRef(null);

   useEffect(() => {
      renderChart(history, currency);
   }, [history, currency]);

   const renderChart = (history, currency) => {
      const ctx = document.getElementById('exchangeRateChart');
      if (ctx) {
         if (chartRef.current) {
            chartRef.current.destroy();
         }

         chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
               labels: history.map((entry) => entry.date),
               datasets: [
                  {
                     label: `${currency} - Buy Rate`,
                     data: history.map((entry) => entry.buy),
                     borderColor: 'rgba(75, 192, 192, 1)',
                     borderWidth: 2,
                     fill: false,
                     pointRadius: 3,
                  },
                  {
                     label: `${currency} - Sell Rate`,
                     data: history.map((entry) => entry.sell),
                     borderColor: 'rgba(255, 99, 132, 1)',
                     borderWidth: 2,
                     fill: false,
                     pointRadius: 3,
                  },
               ],
            },

            options: {
               scales: {
                  xAxes: [{
                     type: 'time',
                     position: 'bottom',
                  }],
               },
               aspectRatio: false,
            },
         });
      }
   };

   return <canvas id="exchangeRateChart" width={width} height={height}></canvas>;
};

export default ExchangeRateChart;
