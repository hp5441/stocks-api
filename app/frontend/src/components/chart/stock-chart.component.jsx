import React from "react";

import { utcDay } from "d3-time";
import { format } from "d3-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { EdgeIndicator } from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";

class CandleStickChart extends React.Component {
  render() {
    const { type, width, data: initialData, ratio } = this.props;
    console.log(initialData, "from chart");

    function tooltipContent() {
      return ({ currentItem, xAccessor }) => {
        return {
          x: new Date(xAccessor(currentItem)).toISOString(),
          y: [
            {
              label: "open",
              value: currentItem.open && currentItem.open.toFixed(2),
            },
            {
              label: "high",
              value: currentItem.high && currentItem.high.toFixed(2),
            },
            {
              label: "low",
              value: currentItem.low && currentItem.low.toFixed(2),
            },
            {
              label: "close",
              value: currentItem.close && currentItem.close.toFixed(2),
            },
          ].filter((line) => line.value),
        };
      };
    }

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];
    return (
      <ChartCanvas
        height={400}
        ratio={ratio}
        width={width}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          yExtents={[(d) => [d.high, d.low]]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis axisAt="bottom" orient="bottom" />

          <YAxis axisAt="right" orient="right" ticks={5} />

          <CandlestickSeries />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />
          <HoverTooltip tooltipContent={tooltipContent([])} fontSize={15} />
        </Chart>
        <Chart
          id={2}
          yExtents={[(d) => d.volume]}
          height={150}
          origin={(w, h) => [0, h - 150]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
          />

          <BarSeries
            yAccessor={(d) => d.volume}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />
        </Chart>
      </ChartCanvas>
    );
  }
}

CandleStickChart.defaultProps = {
  type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
