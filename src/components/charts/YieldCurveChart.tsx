'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Define the shape of a yield curve point
interface YieldCurvePoint {
  tenor: string;
  years: number;
  rate: number;
}

// Main component props
interface YieldCurveChartProps {
  data: YieldCurvePoint[];
  forwardRates?: YieldCurvePoint[];
  title?: string;
  height?: number | string;
  showGrid?: boolean;
  yAxisDomain?: [number, number];
  curveType?: 'zero' | 'par' | 'forward';
  curveMethod?: 'cubic' | 'linear' | 'nss' | 'smithwilson';
  showForwardCurve?: boolean;
  highlightArea?: {
    start: number;
    end: number;
    label?: string;
  };
  referenceLine?: {
    value: number;
    label?: string;
  };
}

export default function YieldCurveChart({
  data,
  forwardRates,
  title,
  height = 400,
  showGrid = true,
  yAxisDomain,
  curveType = 'zero',
  curveMethod = 'cubic',
  showForwardCurve = false,
  highlightArea,
  referenceLine
}: YieldCurveChartProps) {
  // State for active curves
  const [activeCurves, setActiveCurves] = useState<{main: boolean, forward: boolean}>({
    main: true,
    forward: true
  });

  // State for zoom
  const [zoom, setZoom] = useState<{start: number, end: number} | null>(null);
  
  // Process the data for the chart
  const sortedData = [...data].sort((a, b) => a.years - b.years);
  
  // Calculate min and max values for y-axis domain if not provided
  const calculateYAxisDomain = () => {
    if (yAxisDomain) return yAxisDomain;
    
    const allRates = [...sortedData.map(d => d.rate)];
    if (showForwardCurve && forwardRates) {
      allRates.push(...forwardRates.map(d => d.rate));
    }
    
    const minRate = Math.min(...allRates);
    const maxRate = Math.max(...allRates);
    
    // Add 10% padding
    const padding = (maxRate - minRate) * 0.1;
    return [Math.max(0, minRate - padding), maxRate + padding];
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as YieldCurvePoint;
      
      return (
        <div className="custom-tooltip bg-white p-3 shadow-md border border-neutral-200 rounded-md">
          <p className="font-medium text-neutral-800">{point.tenor} ({point.years.toFixed(2)} years)</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-neutral-600">{entry.name}:</span>
                </div>
                <span className="text-sm font-medium ml-3">
                  {entry.value.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Custom legend that allows toggling curves
  const CustomLegend = () => {
    return (
      <div className="flex justify-center space-x-4 mb-2">
        <button
          className={`px-2 py-1 text-xs rounded flex items-center space-x-1 ${
            activeCurves.main 
              ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200' 
              : 'bg-neutral-100 text-neutral-500'
          }`}
          onClick={() => setActiveCurves({...activeCurves, main: !activeCurves.main})}
        >
          <div className="w-3 h-3 rounded-full bg-primary-600" />
          <span>{curveType === 'zero' ? 'Zero Curve' : curveType === 'par' ? 'Par Curve' : 'Forward Curve'}</span>
        </button>
        
        {showForwardCurve && forwardRates && (
          <button
            className={`px-2 py-1 text-xs rounded flex items-center space-x-1 ${
              activeCurves.forward 
                ? 'bg-secondary-100 text-secondary-800 ring-1 ring-secondary-200' 
                : 'bg-neutral-100 text-neutral-500'
            }`}
            onClick={() => setActiveCurves({...activeCurves, forward: !activeCurves.forward})}
          >
            <div className="w-3 h-3 rounded-full bg-secondary-600" />
            <span>Forward Rates</span>
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-2 text-center">{title}</h3>}
      
      <CustomLegend />
      
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />}
            
            <XAxis
              dataKey="years"
              type="number"
              domain={zoom ? [zoom.start, zoom.end] : [0, 'dataMax']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}Y`}
              label={{ 
                value: 'Maturity (Years)', 
                position: 'insideBottom', 
                offset: -5,
                fontSize: 12
              }}
            />
            
            <YAxis
              domain={calculateYAxisDomain()}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Rate (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fontSize: 12
                }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {highlightArea && (
              <ReferenceArea
                x1={highlightArea.start}
                x2={highlightArea.end}
                strokeOpacity={0.3}
                fill="#8884d8"
                fillOpacity={0.1}
                label={highlightArea.label ? {
                  value: highlightArea.label,
                  position: 'insideTopRight',
                  fontSize: 11
                } : undefined}
              />
            )}
            
            {referenceLine && (
              <ReferenceLine
                y={referenceLine.value}
                stroke="#ff7300"
                strokeDasharray="3 3"
                label={referenceLine.label ? {
                  value: referenceLine.label,
                  position: 'right',
                  fontSize: 11
                } : undefined}
              />
            )}
            
            {activeCurves.main && (
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#7c3aed"
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                name={curveType === 'zero' ? 'Zero Rate' : curveType === 'par' ? 'Par Rate' : 'Forward Rate'}
                connectNulls
                dot={{ r: 3, strokeWidth: 0, fill: '#7c3aed' }}
              />
            )}
            
            {showForwardCurve && forwardRates && activeCurves.forward && (
              <Line
                type="monotone"
                data={forwardRates.sort((a, b) => a.years - b.years)}
                dataKey="rate"
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Forward Rate"
                connectNulls
                dot={{ r: 2, strokeWidth: 0, fill: '#9333ea' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-2 mt-2">
        <button
          className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded"
          onClick={() => setZoom(null)}
        >
          Reset Zoom
        </button>
        <button
          className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded"
          onClick={() => setZoom({start: 0, end: 5})}
        >
          0-5Y
        </button>
        <button
          className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded"
          onClick={() => setZoom({start: 0, end: 10})}
        >
          0-10Y
        </button>
        <button
          className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded"
          onClick={() => setZoom({start: 5, end: 30})}
        >
          5-30Y
        </button>
      </div>
      
      <div className="text-xs text-neutral-500 mt-3">
        <p className="text-center">
          {curveMethod === 'cubic' ? 'Cubic Spline Interpolation' :
           curveMethod === 'nss' ? 'Nelson-Siegel-Svensson Model' :
           curveMethod === 'smithwilson' ? 'Smith-Wilson Method' : 'Linear Interpolation'}
        </p>
      </div>
    </div>
  );
}