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
      
      {/* QuantLib Feature Highlight Banner - More compact for 1920x1080 */}
      <div className="mb-4 bg-gradient-to-r from-primary-100/70 via-primary-50/60 to-primary-100/40 rounded-xl p-3 border border-primary-200 shadow-sm">
        <div className="flex flex-wrap items-center">
          <div className="lg:w-1/2 xl:w-3/5 mb-2 lg:mb-0 pr-0 lg:pr-4">
            <div className="flex items-center">
              <div className="hidden sm:block w-10 h-10 bg-primary-100 rounded-lg flex-shrink-0 mr-3 border border-primary-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-2 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-800">Advanced Term Structure Modeling</h2>
                <p className="text-sm text-neutral-700 max-w-3xl">
                  Use QuantLib-powered models to construct, interpolate, and analyze yield curves with 
                  cubic splines, Nelson-Siegel-Svensson, and Smith-Wilson methods.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 xl:w-2/5 grid grid-cols-4 gap-2 w-full lg:ml-auto">
            <div className="bg-white p-2 rounded-lg shadow-sm text-center border border-primary-50">
              <p className="text-xs text-neutral-500 truncate">Available Curves</p>
              <p className="text-lg font-bold text-primary-700">{curves.length}</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-center border border-primary-50">
              <p className="text-xs text-neutral-500 truncate">Methods</p>
              <p className="text-lg font-bold text-primary-700">4</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-center border border-primary-50">
              <p className="text-xs text-neutral-500 truncate">Current Method</p>
              <Badge color="primary" className="mt-1 truncate text-xs">
                {currentCurve ? 
                  currentCurve.curveMethod.charAt(0).toUpperCase() + currentCurve.curveMethod.slice(1) : 
                  'Loading...'}
              </Badge>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-center border border-primary-50">
              <p className="text-xs text-neutral-500 truncate">Curve Type</p>
              <Badge color="secondary" className="mt-1 truncate text-xs">
                {currentCurve ? 
                  currentCurve.curveType.charAt(0).toUpperCase() + currentCurve.curveType.slice(1) : 
                  'Loading...'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area with improved layout for 1920x1080 */}
      <div className="grid grid-cols-12 gap-4">
        {/* Chart area - Takes more space on large screens */}
        <div className="col-span-12 lg:col-span-9">
          <Card 
            className="h-full bg-white" 
            title="QuantLib Yield Curve Chart"
            subtitle="Interactive visualization and analysis with advanced modeling techniques"
            compact={true}
            headerAction={
              <div className="flex space-x-2 items-center">
                <button 
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    showForwardRates 
                      ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200' 
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-primary-50'
                  }`}
                  onClick={() => setShowForwardRates(!showForwardRates)}
                  disabled={isLoading || (currentCurve && currentCurve.curveType !== 'zero')}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Forward Curve
                  </span>
                </button>
                <select
                  className="text-xs border border-neutral-200 rounded-md p-1 bg-white text-neutral-700 hover:border-primary-300 transition-colors"
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
              <div className="flex justify-center items-center h-[450px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : currentCurve ? (
              <YieldCurveChart 
                data={currentCurve.points}
                forwardRates={showForwardRates ? forwardRates : undefined}
                title={`${currentCurve.name} - ${currentCurve.date}`}
                height={450} 
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
        
        {/* Settings panel - More compact for 1920x1080 */}
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-4">
            <Card 
              title="QuantLib Parameters" 
              subtitle="Configure term structure models"
              compact={true}
              className="bg-white"
            >
              <div className="space-y-3">
                <div>
                  <label htmlFor="curve-select" className="block text-xs font-medium text-neutral-700 mb-1">
                    Select Yield Curve
                  </label>
                  <select
                    id="curve-select"
                    className="w-full border border-neutral-200 rounded-md p-1.5 text-sm focus:ring-primary-500 focus:border-primary-500"
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
                  <label htmlFor="interpolation-method" className="block text-xs font-medium text-neutral-700 mb-1">
                    QuantLib Interpolation Method
                  </label>
                  <select
                    id="interpolation-method"
                    className="w-full border border-neutral-200 rounded-md p-1.5 text-sm focus:ring-primary-500 focus:border-primary-500"
                    value={interpolationMethod}
                    onChange={(e) => setInterpolationMethod(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="cubic">Cubic Spline Interpolation</option>
                    <option value="linear">Linear Interpolation</option>
                    <option value="nss">Nelson-Siegel-Svensson</option>
                    <option value="smithwilson">Smith-Wilson Method</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      id="show-forward-rates"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-200 rounded"
                      checked={showForwardRates}
                      onChange={(e) => setShowForwardRates(e.target.checked)}
                      disabled={isLoading || (currentCurve && currentCurve.curveType !== 'zero')}
                    />
                    <label htmlFor="show-forward-rates" className="ml-2 block text-xs text-neutral-700">
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
                    <label htmlFor="interpolate" className="ml-2 block text-xs text-neutral-700">
                      Interpolate Points
                    </label>
                  </div>
                </div>
                
                {interpolate && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="resolution" className="block text-xs font-medium text-neutral-700">
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
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      value={resolution}
                      onChange={(e) => setResolution(parseInt(e.target.value))}
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <div className="pt-1">
                  <button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-1.5 px-3 rounded-md shadow-sm transition-colors disabled:opacity-50 text-sm"
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
                title="QuantLib Model Parameters" 
                subtitle="Term structure fitting parameters"
                compact={true}
                className="bg-white"
              >
                <div className="space-y-2">
                  {Object.entries(currentCurve.modelParameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-neutral-100 last:border-none">
                      <span className="text-xs text-neutral-600">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </span>
                      <span className="font-medium text-xs bg-neutral-50 px-2 py-0.5 rounded">
                        {typeof value === 'number' ? value.toFixed(6) : value}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <h4 className="text-xs font-semibold mb-2 text-neutral-700">Curve Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <span className="block text-xs text-neutral-500">Type</span>
                      <div className="mt-0.5">
                        <Badge color="primary" size="sm">
                          {currentCurve.curveType.charAt(0).toUpperCase() + currentCurve.curveType.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <span className="block text-xs text-neutral-500">Points</span>
                      <span className="font-medium">{currentCurve.points.length}</span>
                    </div>
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <span className="block text-xs text-neutral-500">Currency</span>
                      <span className="font-medium">{currentCurve.currency}</span>
                    </div>
                    <div className="bg-neutral-50 p-1.5 rounded border border-neutral-100">
                      <span className="block text-xs text-neutral-500">Date</span>
                      <span className="font-medium">{currentCurve.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Data table section - More compact */}
      <div className="mt-4">
        <Card 
          title="QuantLib Curve Data Points" 
          subtitle="Market rate points used in yield curve construction"
          compact={true}
          className="bg-white"
          headerAction={
            isLoading ? null : currentCurve ? (
              <button 
                className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 px-2 py-1 rounded-md flex items-center border border-primary-100"
                onClick={() => { 
                  alert('Download functionality would be implemented here');
                }}
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            ) : null
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-16">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : currentCurve ? (
            <div className="overflow-x-auto -mx-3 px-3"> {/* Negative margin with padding to allow full-width scrolling */}
              <table className="min-w-full divide-y divide-neutral-200 table-compact border-collapse">
                <thead className="bg-neutral-50/80">
                  <tr>
                    <th className="table-header w-1/6">
                      Tenor
                    </th>
                    <th className="table-header w-1/6">
                      Years
                    </th>
                    <th className="table-header w-1/6">
                      Rate (%)
                    </th>
                    {showForwardRates && forwardRates.length > 0 && (
                      <th className="table-header w-1/6">
                        Forward Rate (%)
                      </th>
                    )}
                    {interpolate && (
                      <th className="table-header w-1/6">
                        Type
                      </th>
                    )}
                    <th className="table-header w-1/6">
                      ΔRate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {currentCurve.points.map((point, index) => {
                    const matchingForward = forwardRates.find(fr => fr.tenor === point.tenor);
                    const prevPoint = index > 0 ? currentCurve.points[index - 1] : null;
                    const deltaRate = prevPoint ? (point.rate - prevPoint.rate).toFixed(4) : "—";
                    const isPositiveDelta = prevPoint && point.rate > prevPoint.rate;
                    
                    return (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30'} hover:bg-primary-50/30 transition-colors`}>
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
                            ) : '—'}
                          </td>
                        )}
                        {interpolate && (
                          <td className="table-cell">
                            <Badge color="blue" size="sm" className="uppercase">Market</Badge>
                          </td>
                        )}
                        <td className="table-cell">
                          {prevPoint ? (
                            <span className={isPositiveDelta ? 'text-green-600' : 'text-red-600'}>
                              {isPositiveDelta ? '+' : ''}{deltaRate}
                            </span>
                          ) : '—'}
                        </td>
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
            <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap justify-between items-center text-xs text-neutral-500">
              <div className="mb-1 sm:mb-0">
                <span className="font-medium">{currentCurve.points.length}</span> market points used to construct the curve
              </div>
              <div className="flex space-x-3">
                <span>Method: <span className="font-medium">{getMethodName(currentCurve.curveMethod)}</span></span>
                <span>Currency: <span className="font-medium">{currentCurve.currency}</span></span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* QuantLib Education Section */}
      <div className="mt-4 bg-white rounded-lg border border-neutral-100 shadow-sm p-3">
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">QuantLib Technical Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-neutral-100 rounded-md p-2 bg-neutral-50/50">
            <h4 className="text-xs font-medium text-primary-700 mb-1">Cubic Spline Interpolation</h4>
            <p className="text-xs text-neutral-600">Preserves smoothness across data points by ensuring continuous first and second derivatives, ideal for yield curve modeling.</p>
          </div>
          <div className="border border-neutral-100 rounded-md p-2 bg-neutral-50/50">
            <h4 className="text-xs font-medium text-primary-700 mb-1">Nelson-Siegel-Svensson</h4>
            <p className="text-xs text-neutral-600">Parametric model using 6 parameters to capture short, medium, and long-term components of term structure dynamics.</p>
          </div>
          <div className="border border-neutral-100 rounded-md p-2 bg-neutral-50/50">
            <h4 className="text-xs font-medium text-primary-700 mb-1">Smith-Wilson Method</h4>
            <p className="text-xs text-neutral-600">Advanced technique that ensures convergence to an ultimate forward rate for extremely long durations, used by EIOPA and insurers.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}