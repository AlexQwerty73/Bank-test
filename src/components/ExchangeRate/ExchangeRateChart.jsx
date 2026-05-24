import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ExchangeRateChart = ({ history, currency, width = '100%', height = '300px' }) => {
   // Використовуємо ref напряму на canvas — уникаємо конфліктів при кількох графіках на сторінці
   const canvasRef = useRef(null);
   const chartInstanceRef = useRef(null);

   useEffect(() => {
      if (!canvasRef.current || !history?.length) return;

      // Знищуємо попередній екземпляр перед створенням нового
      if (chartInstanceRef.current) {
         chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(canvasRef.current, {
         type: 'line',
         data: {
            labels: history.map((entry) => entry.date),
            datasets: [
               {
                  label: `${currency} — Buy`,
                  data: history.map((entry) => entry.buy),
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  pointRadius: 3,
               },
               {
                  label: `${currency} — Sell`,
                  data: history.map((entry) => entry.sell),
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  pointRadius: 3,
               },
            ],
         },
         options: {
            responsive: true,
            maintainAspectRatio: false,
         },
      });

      // Cleanup при розмонтуванні
      return () => {
         if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
         }
      };
   }, [history, currency]);

   return (
      <div style={{ width, height, position: 'relative' }}>
         <canvas ref={canvasRef} />
      </div>
   );
};

export default ExchangeRateChart;
