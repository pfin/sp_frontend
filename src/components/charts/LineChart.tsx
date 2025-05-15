'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

type DataPoint = {
  [key: string]: any;
};

type DataSeries = {
  name: string;
  dataKey: string;
  color: string;
  strokeWidth?: number;
};

type LineChartProps = {
  data: DataPoint[];
  series: DataSeries[];
  xAxisDataKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  className?: string;
  tooltipFormatter?: (value: ValueType, name: NameType) => [ValueType, NameType];
};

const CustomTooltip = ({ active, payload, label, formatter }: TooltipProps<ValueType, NameType> & { formatter?: (value: ValueType, name: NameType) => [ValueType, NameType] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow border border-neutral-200">
        <p className="font-medium text-xs text-neutral-500 mb-1">{label}</p>
        {payload.map((entry, index) => {
          let value = entry.value;
          let name = entry.name;
          
          if (formatter) {
            [value, name] = formatter(value, name);
          }
          
          return (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {name}: {value}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

export default function LineChart({
  data,
  series,
  xAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  height = 300,
  className = '',
  tooltipFormatter
}: LineChartProps) {
  return (
    <div className={`w-full h-${height} ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fontSize: 12 }} 
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
          <Legend />
          {series.map((s, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.strokeWidth || 2}
              dot={{ stroke: s.color, strokeWidth: 1, r: 3, fill: 'white' }}
              activeDot={{ r: 5, stroke: s.color, strokeWidth: 1, fill: s.color }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}