import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import http from '../api/http';
import '../css/StatsChart.css'; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await http.get('/stats/popularne-predstave');
        // sortiramo predstave po broju prodatih karata (najveće prvo)
        const sorted = [...res.data].sort(
        (a, b) => b.broj_prodatih_karata - a.broj_prodatih_karata
        );

        const labels = sorted.map(item => item.naziv);
        const values = sorted.map(item => item.broj_prodatih_karata);

        // paleta od najtamnije ka najsvetlijoj
        const colors = [
        "#642222",
        "#7a2e2e",
        "#8f3b3b",
        "#a35555",
        "#c07a7a"
        ];

        setChartData({
        labels,
        datasets: [
            {
            label: 'Broj prodatih karata',
            data: values,
            backgroundColor: colors.slice(0, values.length),
            borderColor: "#642222",
            borderWidth: 2,
            borderRadius: 8,
            },
        ],
        });
      } catch (err) {
        console.error("Greška pri učitavanju statistike", err);
      }
    };
    fetchStats();
  }, []);

  if (!chartData) return <p className="chart-loading">Učitavanje analitike...</p>;

  return (
    <div className="stats-chart-wrapper"> 
      <div className="stats-chart-container" style={{ height: "420px" }}>
        <Bar 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              title: { 
                display: true, 
                text: 'Analitika Popularnosti Predstava',
                font: { size: 20, family: 'Playfair Display', weight: 'bold' },
                color: '#333'
              },
            },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Broj prodatih karata',
                font: {
                  size: 14,
                  family: 'Montserrat',
                  weight: 'bold'
                }
              },
              grid: { display: false }
            },
            x: {
              title: {
                display: true,
                text: 'Naziv predstave',
                font: {
                  size: 14,
                  family: 'Montserrat',
                  weight: 'bold'
                }
              },
              grid: { display: false }
            }
          }
          }} 
        />
      </div>
    </div>
  );
};

export default StatsChart;