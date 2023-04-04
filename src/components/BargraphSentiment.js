import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts'

/**
 * Renders a bar chart that displays the sentiment counts for a given dataset.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.data - The data to be plotted in the chart.
 * @param {string[]} props.type - The type of data to be plotted in the chart.
 *
 * @returns {ReactElement} A bar chart that displays the sentiment counts.
 */
function BarGraphSentiment(props) {
  // useState hook to initialize an empty array for x values and y values
  const [xarray, setXarray] = useState([]);
  const [yarray, setYarray] = useState([]);
  // Function to count the number of tweets based on the sentiment
  function filterData(data) {
    let out = {
      'positive': 0,
      'negative': 0,
      'neutral': 0,
    }
    for (var i in props.data) {
      if (i === "filename")
        continue
      out[props.data[i]['sentiment']] += 1
    }
    return out;
  }
  // useEffect hook to update xarray and yarray when the props object changes
  useEffect(() => {
    // reset xarray and yarray to empty arrays
    setXarray([]);
    setYarray([]);
    var tempY = [];
    var tempX = [];
    // get filtered data based on the value of the 'type' key in the props object
    var dict = filterData(props.data, props.type)
    for (var i in dict) {
      if (i === "filename")
        continue
      tempY.push(dict[i]);
      tempX.push(i);
    }
    setXarray(tempX);
    setYarray(tempY);
  }, [props]);

  // options object for the chart with placeholders for the xaxis categories and yaxis data
  const chartOptions = {

    series: [{
      name: "count",
      data: yarray
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: xarray,
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }

      },
      title: {
        text: 'Sentiment vs Tweet Count',
        floating: true,
        align: 'center',
        offsetY: 0,
        style: {
          color: '#444'
        }
      }
    },
  };

  return (
    <div>
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="bar"
        height="300%"
        width="100%"
      />
    </div>
  );
}
export default BarGraphSentiment;