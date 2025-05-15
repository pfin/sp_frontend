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
                  {entry.value.toFixed(4)}%
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
      <div className="flex justify-center space-x-4 mb-3">
        <button
          className={`px-3 py-1.5 text-xs rounded-md flex items-center space-x-2 shadow-sm ${
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
            className={`px-3 py-1.5 text-xs rounded-md flex items-center space-x-2 shadow-sm ${
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

  // Zoom presets with descriptive titles
  const zoomPresets = [
    { label: 'All', action: () => setZoom(null) },
    { label: 'Short End (0-5Y)', action: () => setZoom({start: 0, end: 5}) },
    { label: 'Belly (2-10Y)', action: () => setZoom({start: 2, end: 10}) },
    { label: 'Long End (10-30Y)', action: () => setZoom({start: 10, end: 30}) },
    { label: 'Full Curve (0-30Y)', action: () => setZoom({start: 0, end: 30}) }
  ];
  
  // Format to show more detailed curve information
  const getCurveMethodInfo = () => {
    switch(curveMethod) {
      case 'cubic':
        return 'Cubic Spline Interpolation (Natural Boundary Conditions)';
      case 'nss':
        return 'Nelson-Siegel-Svensson Parametric Model';
      case 'smithwilson':
        return 'Smith-Wilson Method (EIOPA Convergence)';
      case 'linear':
        return 'Linear Interpolation (Piecewise)';
      default:
        return curveMethod;
    }
  };
  
  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-center text-neutral-800">{title}</h3>
          <p className="text-xs text-center text-neutral-500 mt-1">
            {getCurveMethodInfo()} | {curveType.charAt(0).toUpperCase() + curveType.slice(1)} Rates
          </p>
        </div>
      )}
      
      <CustomLegend />
      
      <div className="w-full h-full border border-neutral-100 rounded-lg overflow-hidden shadow-inner bg-neutral-50/50">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={sortedData}
            margin={{ top: 20, right: 40, left: 5, bottom: 20 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />}
            
            <XAxis
              dataKey="years"
              type="number"
              domain={zoom ? [zoom.start, zoom.end] : [0, 'dataMax']}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${value}Y`}
              label={{ 
                value: 'Maturity (Years)', 
                position: 'insideBottom', 
                offset: -5,
                fontSize: 12
              }}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis
              domain={calculateYAxisDomain()}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
              tick={{ fontSize: 11 }}
              label={{ 
                value: 'Rate (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fontSize: 12
                }
              }}
              padding={{ top: 10, bottom: 10 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value, entry, index) => {
                return <span className="text-xs font-medium">{value}</span>;
              }}
            />
            
            {highlightArea && (
              <ReferenceArea
                x1={highlightArea.start}
                x2={highlightArea.end}
                strokeOpacity={0.3}
                fill="#7c3aed"
                fillOpacity={0.08}
                label={highlightArea.label ? {
                  value: highlightArea.label,
                  position: 'insideTopRight',
                  fontSize: 11,
                  fill: '#6d28d9'
                } : undefined}
              />
            )}
            
            {referenceLine && (
              <ReferenceLine
                y={referenceLine.value}
                stroke="#7c3aed"
                strokeDasharray="3 3"
                label={referenceLine.label ? {
                  value: referenceLine.label,
                  position: 'right',
                  fontSize: 11,
                  fill: '#6d28d9'
                } : undefined}
              />
            )}
            
            {activeCurves.main && (
              <Line
                type={curveMethod === 'linear' ? 'linear' : 'monotone'}
                dataKey="rate"
                stroke="#7c3aed"
                strokeWidth={2.5}
                activeDot={{ r: 6, stroke: '#7c3aed', strokeWidth: 1, fill: '#faf5ff' }}
                name={curveType === 'zero' ? 'Zero Rate' : curveType === 'par' ? 'Par Rate' : 'Forward Rate'}
                connectNulls
                dot={{ r: 3, strokeWidth: 0, fill: '#7c3aed' }}
                isAnimationActive={true}
                animationDuration={750}
                animationEasing="ease-in-out"
              />
            )}
            
            {showForwardCurve && forwardRates && activeCurves.forward && (
              <Line
                type={curveMethod === 'linear' ? 'linear' : 'monotone'}
                data={forwardRates.sort((a, b) => a.years - b.years)}
                dataKey="rate"
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Forward Rate"
                connectNulls
                dot={{ r: 2, strokeWidth: 0, fill: '#9333ea' }}
                isAnimationActive={true}
                animationDuration={750}
                animationEasing="ease-in-out"
                animationBegin={250}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {zoomPresets.map((preset, index) => (
          <button
            key={index}
            className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-md shadow-sm font-medium text-neutral-700 transition-colors"
            onClick={preset.action}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-center mt-4 space-x-2 text-xs text-neutral-500">
        <div className="w-4 h-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p>
          {curveMethod === 'cubic' ? 'Cubic splines maintain smoothness at knot points while preserving first and second derivatives.' :
           curveMethod === 'nss' ? 'Nelson-Siegel-Svensson model uses 6 parameters to capture yield curve dynamics across maturities.' :
           curveMethod === 'smithwilson' ? 'Smith-Wilson method ensures convergence to an ultimate forward rate for long durations.' : 
           'Linear interpolation connects rate points with straight line segments.'}
        </p>
      </div>
    </div>
  );
}