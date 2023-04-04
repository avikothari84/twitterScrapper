import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts'

/**
 * Renders a line chart that displays the favorite count for a given dataset.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.data - The data to be plotted in the chart.
 *
 * @returns {ReactElement} A line chart that displays the favorite count.
 */
function LineGraph(props) {
  // useState hook to initialize an empty array for x values and y values
  const [xarray, setXarray] = useState([]);
  const [yarray, setYarray] = useState([]);
  // useEffect hook to update xarray and yarray when the props object changes
  useEffect(() => {
    // reset xarray and yarray to empty arrays
    setXarray([]);
    setYarray([]);
    var tempY = [];
    var tempX = [];
    for (var i in props.data) {
      if (i === "filename")
        continue
      // Store the favorite_count for Y axis
      tempY.push(props.data[i]['favorite_count']);
      // Store the yweet_id for X axis
      tempX.push(props.data[i]['tweet_id']);
    }
    setXarray(tempX);
    setYarray(tempY);
  }, [props.data]);
  // options object for the chart with placeholders for the xaxis categories and yaxis data
  const chartOptions = {
    series: [
      {
        name: 'Likes',
        data: yarray
      }
    ],
    options: {
      chart: {
        background: "white"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        name: 'tweet id',
        categories: xarray
      },
      legend: {
        position: "bottom"
      },
      grid: {
        show: true
      },
      title: {
        text: 'Tweet ID vs Like',
        floating: true,
        align: 'center',
        offsetY: 0,
        style: {
          color: '#444'
        }
      }
    }
  };

  return (
    <div>
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="line"
        height="200%"
        width="100%"
      />
    </div>
  );
}
export default LineGraph;