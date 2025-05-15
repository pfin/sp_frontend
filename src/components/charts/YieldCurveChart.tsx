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
  
  // State for chart view type (line or area)
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  
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
        <div className="bg-white p-3 shadow-lg border border-gray-200 rounded-lg">
          <p className="font-medium text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 w-5 h-5 rounded text-xs font-bold mr-1.5">T</span>
            {point.tenor} ({point.years.toFixed(2)} years)
          </p>
          <div className="space-y-1.5 mt-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}:</span>
                </div>
                <span className="text-sm font-semibold ml-3 bg-gray-50 px-2 py-0.5 rounded">
                  {entry.value.toFixed(4)}%
                </span>
              </div>
            ))}
          </div>
          
          {curveMethod === 'nss' && (
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
              <span className="font-medium">QuantLib NSS Model</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Chart controls component
  const ChartControls = () => {
    return (
      <div className="flex flex-wrap items-center justify-between mb-4 bg-gray-50 rounded-lg p-2 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-white border border-gray-200 rounded-md flex text-xs">
            <button
              className={`px-3 py-1.5 font-medium rounded-l-md ${chartType === 'line' 
                ? 'bg-indigo-50 text-indigo-700 border-r border-indigo-100' 
                : 'text-gray-700 hover:bg-gray-50 border-r border-gray-200'
              }`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button
              className={`px-3 py-1.5 font-medium rounded-r-md ${chartType === 'area' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setChartType('area')}
            >
              Area
            </button>
          </div>

          <div className="h-4 border-r border-gray-300 mx-1"></div>

          <button
            className={`px-3 py-1.5 text-xs rounded-md flex items-center font-medium ${
              activeCurves.main 
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setActiveCurves({...activeCurves, main: !activeCurves.main})}
          >
            <div className="w-2 h-2 rounded-full bg-indigo-600 mr-1.5" />
            {curveType === 'zero' ? 'Zero Curve' : curveType === 'par' ? 'Par Curve' : 'Forward Curve'}
          </button>
          
          {showForwardCurve && forwardRates && (
            <button
              className={`px-3 py-1.5 text-xs rounded-md flex items-center font-medium ${
                activeCurves.forward 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setActiveCurves({...activeCurves, forward: !activeCurves.forward})}
            >
              <div className="w-2 h-2 rounded-full bg-purple-600 mr-1.5" />
              Forward Rates
            </button>
          )}
        </div>
        
        <div className="flex items-center mt-2 sm:mt-0">
          <span className="text-xs text-gray-500 mr-2">Zoom:</span>
          <div className="flex bg-white border border-gray-200 rounded-md text-xs divide-x divide-gray-200">
            {zoomPresets.map((preset, index) => (
              <button
                key={index}
                className={`px-2 py-1 font-medium ${
                  (zoom === null && preset.label === 'All') || 
                  (zoom && zoom.start === preset.range?.start && zoom.end === preset.range?.end)
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                } ${index === 0 ? 'rounded-l-md' : ''} ${index === zoomPresets.length - 1 ? 'rounded-r-md' : ''}`}
                onClick={preset.action}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Zoom presets with descriptive titles
  const zoomPresets = [
    { label: 'All', action: () => setZoom(null), range: null },
    { label: '0-5Y', action: () => setZoom({start: 0, end: 5}), range: {start: 0, end: 5} },
    { label: '2-10Y', action: () => setZoom({start: 2, end: 10}), range: {start: 2, end: 10} },
    { label: '10-30Y', action: () => setZoom({start: 10, end: 30}), range: {start: 10, end: 30} }
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {getCurveMethodInfo()}
            </p>
          </div>
          
          <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <span className="mr-1.5 text-xs font-medium text-indigo-700">QuantLib</span>
            <span className="text-xs bg-indigo-100 px-1.5 py-0.5 rounded-full text-indigo-800">{curveType.toUpperCase()}</span>
          </div>
        </div>
      )}
      
      <ChartControls />
      
      <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            
            <XAxis
              dataKey="years"
              type="number"
              domain={zoom ? [zoom.start, zoom.end] : [0, 'dataMax']}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(value) => `${value}Y`}
              label={{ 
                value: 'Maturity (Years)', 
                position: 'insideBottom', 
                offset: -10,
                fontSize: 12,
                fill: '#4b5563'
              }}
              padding={{ left: 0, right: 8 }}
              stroke="#d1d5db"
            />
            
            <YAxis
              domain={calculateYAxisDomain()}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ 
                value: 'Rate (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fontSize: 12,
                  fill: '#4b5563'
                }
              }}
              padding={{ top: 15, bottom: 15 }}
              stroke="#d1d5db"
              width={45}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {highlightArea && (
              <ReferenceArea
                x1={highlightArea.start}
                x2={highlightArea.end}
                strokeOpacity={0.3}
                fill="#818cf8"
                fillOpacity={0.1}
                stroke="#6366f1"
                strokeDasharray="3 3"
                label={highlightArea.label ? {
                  value: highlightArea.label,
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: '#4f46e5'
                } : undefined}
              />
            )}
            
            {referenceLine && (
              <ReferenceLine
                y={referenceLine.value}
                stroke="#818cf8"
                strokeDasharray="3 3"
                label={referenceLine.label ? {
                  value: referenceLine.label,
                  position: 'right',
                  fontSize: 10,
                  fill: '#4f46e5'
                } : undefined}
              />
            )}
            
            {activeCurves.main && (
              <>
                {chartType === 'area' ? (
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                ) : null}
                
                <Line
                  type={curveMethod === 'linear' ? 'linear' : 'monotone'}
                  dataKey="rate"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 0, fill: '#4f46e5' }}
                  activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 1, fill: '#eef2ff' }}
                  name={curveType === 'zero' ? 'Zero Rate' : curveType === 'par' ? 'Par Rate' : 'Forward Rate'}
                  connectNulls
                  isAnimationActive={true}
                  animationDuration={750}
                  animationEasing="ease-out"
                  fill={chartType === 'area' ? "url(#colorRate)" : undefined}
                />
              </>
            )}
            
            {showForwardCurve && forwardRates && activeCurves.forward && (
              <Line
                type={curveMethod === 'linear' ? 'linear' : 'monotone'}
                data={forwardRates.sort((a, b) => a.years - b.years)}
                dataKey="rate"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2, strokeWidth: 0, fill: '#8b5cf6' }}
                name="Forward Rate"
                connectNulls
                isAnimationActive={true}
                animationDuration={750}
                animationEasing="ease-out"
                animationBegin={250}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-start mt-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1.5"></span>
            <span className="font-medium">{curveType.charAt(0).toUpperCase() + curveType.slice(1)} Rate</span>
          </div>
          
          {showForwardCurve && forwardRates && (
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></span>
              <span className="font-medium">Forward Rate</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end">
          <div className="bg-indigo-50 rounded-lg p-1.5 flex items-center text-xs text-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.29 7 12 12 20.71 7"></polyline>
              <line x1="12" y1="22" x2="12" y2="12"></line>
            </svg>
            <span className="font-medium">Powered by QuantLib</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-1.5 text-indigo-600">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          About {curveMethod.toUpperCase()} Interpolation
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          {curveMethod === 'cubic' 
            ? 'Cubic splines maintain smoothness at knot points while preserving first and second derivatives, creating a fluid curve that better represents continuous rate changes across the term structure.' 
            : curveMethod === 'nss' 
              ? 'The Nelson-Siegel-Svensson model uses 6 parameters to capture yield curve dynamics across maturities. This parametric approach excels at modeling complex shapes while ensuring economically reasonable forward rates.' 
              : curveMethod === 'smithwilson' 
                ? 'The Smith-Wilson method ensures convergence to an ultimate forward rate for long durations, making it particularly valuable for extrapolating yield curves beyond observable market data - a key requirement for insurance applications.' 
                : 'Linear interpolation connects rate points with straight line segments, offering a simple but less accurate representation of the yield curve that may miss important curvature between observed points.'}
        </p>
      </div>
    </div>
  );
}