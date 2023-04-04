import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts'

/*
This component is a pie chart that displays the breakdown of tweet types in a dataset. 
It takes in data as a prop and uses that data to calculate the proportions of Retweets, Replies, Mentions, and Normal Text tweets. 
The chart is rendered using the react-apexcharts library.
*/
function PieGraph(props) {

  // useState hook to initialize an empty array for series
  const [series, setSeries] = useState([]);

  // useEffect hook to update data for storing type of reply.
  useEffect(() => {
    setSeries([]);
    var tempSeries = [];
    var dict = {
      "RT": 0,
      "Replies": 0,
      "Mention": 0,
      "NT": 0
    }
    for (var i in props.data) {
      if (i === "filename")
        continue
      if (props.data[i]['text'].substring(0, 2) === "RT") {
        dict["RT"] += 1;
      }
      else if (props.data[i]['text'].substring(0, 1) === "@") {
        dict["Replies"] += 1;
      }
      else if (props.data[i]['text'].includes("@")) {
        dict["Mention"] += 1;
      }
      else {
        dict["NT"] += 1;
      }
    }
    for (var i in dict) {
      if (i === "filename")
        continue
      tempSeries.push(dict[i]);
    }
    setSeries(tempSeries);
  }, [props.data]);

  // options object for the chart with placeholders for the xpie chart.
  const chartOptions = {

    series: series,
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ["Retweets", "Replies", "Mentions", "Normal Text"],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },


  };

  return (
    <div>
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="pie"
        height="150%"
        width="100%"

      />
    </div>
  );
}
export default PieGraph;