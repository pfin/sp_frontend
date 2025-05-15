'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import YieldCurveChart from '@/components/charts/YieldCurveChart';

interface YieldCurvePoint {
  tenor: string;
  years: number;
  rate: number;
}

interface YieldCurveData {
  date: string;
  name: string;
  curveType: 'zero' | 'par' | 'forward';
  currency: string;
  points: YieldCurvePoint[];
  curveMethod: 'cubic' | 'linear' | 'nss' | 'smithwilson';
  modelParameters?: {
    [key: string]: number;
  };
}

export default function YieldCurvesPage() {
  const [curves, setCurves] = useState<YieldCurveData[]>([]);
  const [selectedCurve, setSelectedCurve] = useState<number>(0);
  const [showForwardRates, setShowForwardRates] = useState<boolean>(false);
  const [forwardRates, setForwardRates] = useState<YieldCurvePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [interpolationMethod, setInterpolationMethod] = useState<string>('cubic');
  const [interpolate, setInterpolate] = useState<boolean>(true);
  const [resolution, setResolution] = useState<number>(100);

  // Fetch curve data
  useEffect(() => {
    const fetchCurves = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/yield-curve');
        if (!response.ok) {
          throw new Error('Failed to fetch yield curves');
        }
        const data = await response.json();
        setCurves(data);
        setSelectedCurve(0);
      } catch (error) {
        console.error('Error fetching yield curves:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurves();
  }, []);

  // Fetch forward rates when needed
  useEffect(() => {
    if (!showForwardRates || !curves[selectedCurve]) return;

    const fetchForwardRates = async () => {
      try {
        const response = await fetch(`/api/yield-curve?id=${selectedCurve}&forwards=true&interpolate=${interpolate}&resolution=${resolution}`);
        if (!response.ok) {
          throw new Error('Failed to fetch forward rates');
        }
        const data = await response.json();
        // The forward curve will be the second element in the response array
        if (data && data.length > 1) {
          setForwardRates(data[1].points);
        }
      } catch (error) {
        console.error('Error fetching forward rates:', error);
      }
    };

    if (curves[selectedCurve].curveType === 'zero') {
      fetchForwardRates();
    }
  }, [selectedCurve, showForwardRates, curves, interpolate, resolution]);

  // Process yield curve data for display
  const getSelectedCurve = () => {
    if (!curves || curves.length === 0 || selectedCurve >= curves.length) {
      return null;
    }
    return curves[selectedCurve];
  };

  const currentCurve = getSelectedCurve();

  const breadcrumbs = [
    { name: 'Yield Curves', href: '/yield-curves', current: true }
  ];

  const getMethodName = (method: string) => {
    switch (method) {
      case 'cubic': return 'Cubic Spline';
      case 'linear': return 'Linear';
      case 'nss': return 'Nelson-Siegel-Svensson';
      case 'smithwilson': return 'Smith-Wilson';
      default: return method;
    }
  };

  return (
    <MainLayout>
      <Header 
        title="QuantLib Yield Curve Builder" 
        subtitle="Build, visualize and analyze yield curves using advanced quantitative models"
        breadcrumbs={breadcrumbs}
      />
      
      <div className="mb-6 quantlib-section">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="lg:w-2/3 mb-4 lg:mb-0">
            <h2 className="text-lg font-semibold text-primary-800 mb-1">Advanced Term Structure Modeling</h2>
            <p className="text-sm text-neutral-700 lg:pr-4">
              Use QuantLib-powered models to construct, interpolate, and analyze yield curves. Apply various 
              modeling techniques including cubic splines, Nelson-Siegel-Svensson, and Smith-Wilson methods.
            </p>
          </div>
          <div className="lg:w-1/3 grid grid-cols-3 gap-2 lg:ml-auto">
            <div className="bg-white p-2 rounded-lg shadow-sm text-center">
              <p className="text-xs text-neutral-500">Available Curves</p>
              <p className="text-xl font-bold text-primary-700">{curves.length}</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-center">
              <p className="text-xs text-neutral-500">Methods</p>
              <p className="text-xl font-bold text-primary-700">4</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-center">
              <p className="text-xs text-neutral-500">Current</p>
              <Badge color="primary" className="mt-1">
                {currentCurve ? 
                  currentCurve.curveMethod.charAt(0).toUpperCase() + currentCurve.curveMethod.slice(1) : 
                  'Loading...'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card 
            className="h-full bg-white" 
            title="Yield Curve Chart"
            subtitle="Interactive visualization and analysis"
            headerAction={
              <div className="flex space-x-2">
                <button 
                  className={`text-xs px-2 py-1 rounded ${
                    showForwardRates 
                      ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200' 
                      : 'bg-white text-neutral-600 border border-neutral-200'
                  }`}
                  onClick={() => setShowForwardRates(!showForwardRates)}
                  disabled={isLoading || (currentCurve && currentCurve.curveType !== 'zero')}
                >
                  Forward Curve
                </button>
                <select
                  className="text-xs border border-neutral-200 rounded p-1 bg-white text-neutral-700"
                  value={interpolationMethod}
                  onChange={(e) => setInterpolationMethod(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="cubic">Cubic Spline</option>
                  <option value="linear">Linear</option>
                  <option value="nss">Nelson-Siegel</option>
                  <option value="smithwilson">Smith-Wilson</option>
                </select>
              </div>
            }
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : currentCurve ? (
              <YieldCurveChart 
                data={currentCurve.points}
                forwardRates={showForwardRates ? forwardRates : undefined}
                title={`${currentCurve.name} - ${currentCurve.date}`}
                height={500}
                showGrid={true}
                curveType={currentCurve.curveType}
                curveMethod={currentCurve.curveMethod}
                showForwardCurve={showForwardRates}
                highlightArea={
                  currentCurve.curveType === 'zero' ? {
                    start: 2,
                    end: 5,
                    label: '2Y-5Y Segment'
                  } : undefined
                }
                referenceLine={
                  currentCurve.points.length > 0 ? {
                    value: currentCurve.points.reduce((sum, point) => sum + point.rate, 0) / currentCurve.points.length,
                    label: 'Avg Rate'
                  } : undefined
                }
              />
            ) : (
              <div className="text-center py-10">No curve data available</div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card 
            title="Curve Settings" 
            subtitle="Configure curve parameters"
            className="mb-6"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="curve-select" className="block text-sm font-medium text-neutral-700 mb-1">
                  Select Curve
                </label>
                <select
                  id="curve-select"
                  className="w-full border border-neutral-200 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  value={selectedCurve}
                  onChange={(e) => setSelectedCurve(parseInt(e.target.value))}
                  disabled={isLoading}
                >
                  {curves.map((curve, index) => (
                    <option key={index} value={index}>
                      {curve.name} ({curve.currency})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="interpolation-method" className="block text-sm font-medium text-neutral-700 mb-1">
                  Interpolation Method
                </label>
                <select
                  id="interpolation-method"
                  className="w-full border border-neutral-200 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  value={interpolationMethod}
                  onChange={(e) => setInterpolationMethod(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="cubic">Cubic Spline</option>
                  <option value="linear">Linear</option>
                  <option value="nss">Nelson-Siegel-Svensson</option>
                  <option value="smithwilson">Smith-Wilson</option>
                </select>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="show-forward-rates"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-200 rounded"
                    checked={showForwardRates}
                    onChange={(e) => setShowForwardRates(e.target.checked)}
                    disabled={isLoading || (currentCurve && currentCurve.curveType !== 'zero')}
                  />
                  <label htmlFor="show-forward-rates" className="ml-2 block text-sm text-neutral-700">
                    Forward Rates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="interpolate"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-200 rounded"
                    checked={interpolate}
                    onChange={(e) => setInterpolate(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="interpolate" className="ml-2 block text-sm text-neutral-700">
                    Interpolate
                  </label>
                </div>
              </div>
              
              {interpolate && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="resolution" className="block text-sm font-medium text-neutral-700">
                      Resolution
                    </label>
                    <span className="text-xs text-neutral-500">{resolution} points</span>
                  </div>
                  <input
                    id="resolution"
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    value={resolution}
                    onChange={(e) => setResolution(parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div className="pt-2">
                <button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md shadow-sm transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => {
                    // This would regenerate the curve with the selected parameters
                    // In a real app, we would call the API with the new parameters
                    alert('Curve regeneration would be implemented here');
                  }}
                >
                  Generate Curve
                </button>
              </div>
            </div>
          </Card>
          
          {currentCurve && currentCurve.modelParameters && (
            <Card 
              title="Model Parameters" 
              subtitle="Curve fitting parameters"
            >
              <div className="space-y-2">
                {Object.entries(currentCurve.modelParameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-1 border-b border-neutral-100 last:border-none">
                    <span className="text-sm text-neutral-600">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span className="font-medium text-sm bg-neutral-50 px-2 py-0.5 rounded">
                      {typeof value === 'number' ? value.toFixed(6) : value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-semibold mb-2 text-neutral-700">Curve Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-neutral-50 p-2 rounded">
                    <span className="block text-xs text-neutral-500">Type</span>
                    <div className="mt-1">
                      <Badge color="primary" size="sm">
                        {currentCurve.curveType.charAt(0).toUpperCase() + currentCurve.curveType.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded">
                    <span className="block text-xs text-neutral-500">Points</span>
                    <span className="font-medium">{currentCurve.points.length}</span>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded">
                    <span className="block text-xs text-neutral-500">Currency</span>
                    <span className="font-medium">{currentCurve.currency}</span>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded">
                    <span className="block text-xs text-neutral-500">Date</span>
                    <span className="font-medium">{currentCurve.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Card 
          title="Curve Data" 
          subtitle="Rate points used in curve construction"
          headerAction={
            isLoading ? null : currentCurve ? (
              <button 
                className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 px-2 py-1 rounded flex items-center"
                onClick={() => { 
                  alert('Download functionality would be implemented here');
                }}
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CSV
              </button>
            ) : null
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : currentCurve ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 table-compact">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="table-header">
                      Tenor
                    </th>
                    <th className="table-header">
                      Years
                    </th>
                    <th className="table-header">
                      Rate (%)
                    </th>
                    {showForwardRates && forwardRates.length > 0 && (
                      <th className="table-header">
                        Forward Rate (%)
                      </th>
                    )}
                    {interpolate && (
                      <th className="table-header">
                        Type
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {currentCurve.points.map((point, index) => {
                    const matchingForward = forwardRates.find(fr => fr.tenor === point.tenor);
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                        <td className="table-cell font-medium text-primary-700">
                          {point.tenor}
                        </td>
                        <td className="table-cell">
                          {point.years.toFixed(3)}
                        </td>
                        <td className="table-cell font-medium">
                          {point.rate.toFixed(4)}
                        </td>
                        {showForwardRates && forwardRates.length > 0 && (
                          <td className="table-cell">
                            {matchingForward ? (
                              <span className={matchingForward.rate > point.rate ? 'text-green-600' : 'text-red-600'}>
                                {matchingForward.rate.toFixed(4)}
                              </span>
                            ) : '-'}
                          </td>
                        )}
                        {interpolate && (
                          <td className="table-cell">
                            <Badge color="blue" size="sm" className="uppercase">Market</Badge>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">No curve data available</div>
          )}
          
          {currentCurve && (
            <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500">
              <div>
                <span className="font-medium">{currentCurve.points.length}</span> market points used to construct the curve
              </div>
              <div>
                <span className="font-medium">{currentCurve.curveMethod}</span> interpolation method
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}