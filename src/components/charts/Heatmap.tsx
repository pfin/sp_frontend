'use client';

import React from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';

type HeatmapCell = {
  x: number;
  y: number;
  value: number;
  label: string;
};

type HeatmapProps = {
  data: HeatmapCell[];
  xLabels: string[];
  yLabels: string[];
  minValue?: number;
  maxValue?: number;
  height?: number;
  colorScale?: string[];
  className?: string;
  onCellClick?: (cell: HeatmapCell) => void;
};

export default function Heatmap({
  data,
  xLabels,
  yLabels,
  minValue = 0,
  maxValue = 100,
  height = 300,
  colorScale = ['#f7fbff', '#c6dbef', '#85bcdb', '#3182bd', '#08519c'],
  className = '',
  onCellClick
}: HeatmapProps) {
  const [tooltipContent, setTooltipContent] = React.useState<{ content: string; x: number; y: number } | null>(null);
  
  // Calculate color based on value using the color scale
  const getColor = (value: number) => {
    // Normalize value between 0 and 1
    const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
    
    // Map to color scale index
    const index = Math.floor(normalizedValue * (colorScale.length - 1));
    
    return colorScale[index];
  };
  
  // Calculate dimensions
  const cellWidth = 100 / xLabels.length;
  const cellHeight = 100 / yLabels.length;
  
  return (
    <div 
      className={`w-full overflow-hidden ${className}`} 
      style={{ height, position: 'relative' }}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Y axis labels */}
        <div 
          className="absolute top-0 left-0 flex flex-col justify-between h-full pb-6" 
          style={{ width: '50px' }}
        >
          {yLabels.map((label, i) => (
            <div 
              key={i} 
              className="text-xs text-neutral-600 text-right pr-2 flex items-center justify-end"
              style={{ height: `${cellHeight}%` }}
            >
              {label}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div 
          className="absolute top-0 right-0" 
          style={{ width: 'calc(100% - 50px)', height: 'calc(100% - 20px)' }}
        >
          <div className="w-full h-full relative">
            {data.map((cell, i) => (
              <div
                key={i}
                className="absolute border border-white cursor-pointer flex items-center justify-center text-xs font-medium transition hover:opacity-90"
                style={{
                  left: `${cell.x * cellWidth}%`,
                  top: `${cell.y * cellHeight}%`,
                  width: `${cellWidth}%`,
                  height: `${cellHeight}%`,
                  backgroundColor: getColor(cell.value),
                  color: cell.value > (maxValue + minValue) / 2 ? 'white' : 'black',
                }}
                onClick={() => onCellClick && onCellClick(cell)}
                onMouseEnter={(e) => {
                  setTooltipContent({
                    content: `${cell.label}: ${cell.value.toFixed(2)}`,
                    x: e.clientX,
                    y: e.clientY
                  });
                }}
                onMouseLeave={() => setTooltipContent(null)}
              >
                {cell.value.toFixed(1)}
              </div>
            ))}
          </div>
        </div>
        
        {/* X axis labels */}
        <div 
          className="absolute bottom-0 left-0 flex justify-between w-full pl-12" 
          style={{ height: '20px' }}
        >
          {xLabels.map((label, i) => (
            <div 
              key={i} 
              className="text-xs text-neutral-600 transform -rotate-45 origin-top-left"
              style={{ width: `${cellWidth}%` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="absolute bg-white shadow-md rounded p-2 text-sm z-10 pointer-events-none"
          style={{
            left: tooltipContent.x + 10,
            top: tooltipContent.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {tooltipContent.content}
        </div>
      )}
    </div>
  );
}