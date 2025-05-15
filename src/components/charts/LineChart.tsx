'use client';

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

type SeriesConfig = {
  name: string;
  dataKey: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  dot?: boolean | object;
};

type LineChartProps = {
  data: any[];
  xAxis: string;
  series: SeriesConfig[];
  height?: number | string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  yAxisDomain?: [number, number] | [string, string];
  tooltipFormatter?: (value: number, name: string, entry: any) => string | number;
  grid?: boolean;
};

export default function LineChart({
  data,
  xAxis,
  series,
  height = 400,
  yAxisLabel,
  xAxisLabel,
  yAxisDomain = ['auto', 'auto'],
  tooltipFormatter,
  grid = true
}: LineChartProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 shadow-md border border-neutral-200 rounded-md">
          <p className="font-medium text-neutral-800">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-neutral-600">{item.name}:</span>
                </div>
                <span className="text-sm font-medium ml-3">
                  {tooltipFormatter
                    ? tooltipFormatter(item.value as number, item.name as string, item.payload)
                    : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 25 }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />}
          <XAxis
            dataKey={xAxis}
            tick={{ fontSize: 12, fill: '#525252' }}
            axisLine={{ stroke: '#d4d4d4' }}
            tickLine={{ stroke: '#d4d4d4' }}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: 'insideBottom',
                    offset: -5,
                    fill: '#525252',
                    fontSize: 12
                  }
                : undefined
            }
          />
          <YAxis
            domain={yAxisDomain}
            tick={{ fontSize: 12, fill: '#525252' }}
            axisLine={{ stroke: '#d4d4d4' }}
            tickLine={{ stroke: '#d4d4d4' }}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#525252', fontSize: 12 }
                  }
                : undefined
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
          {series.map((s, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.strokeWidth || 2}
              strokeDasharray={s.strokeDasharray || ''}
              dot={s.dot || { r: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}