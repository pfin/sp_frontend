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
  const [tableView, setTableView] = useState<'compact' | 'full'>('compact');

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
    { name: 'Dashboard', href: '/', current: false },
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

  // Actions for the header
  const headerActions = (
    <div className="flex items-center space-x-2">
      <button
        className="inline-flex items-center px-3 py-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-medium text-indigo-700 transition-colors"
        onClick={() => {
          // This would export the current curve to CSV
          alert('Export functionality would be implemented here');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>
      <button
        className="inline-flex items-center px-3 py-1.5 border border-transparent bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium text-white shadow-sm transition-colors"
        onClick={() => {
          // This would regenerate the curve with the selected parameters
          alert('Curve regeneration would be implemented here');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Generate Curve
      </button>
    </div>
  );

  return (
    <MainLayout>
      <Header 
        title="QuantLib Yield Curve Builder" 
        subtitle="Build, visualize and analyze yield curves using advanced quantitative models"
        breadcrumbs={breadcrumbs}
        actions={headerActions}
        showQuantLibBadge={true}
      />
      
      {/* Main content area with improved layout for 1920x1080 */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left sidebar - Settings panel */}
        <div className="col-span-12 lg:col-span-3 space-y-5">
          {/* QuantLib Feature Highlight */}
          <Card 
            variant="glass" 
            className="bg-gradient-to-br from-indigo-50/90 via-indigo-50/70 to-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm"
          >
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 p-1.5 rounded-md bg-indigo-100 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-indigo-800">QuantLib Term Structure</h2>
                <p className="text-xs text-indigo-600">Advanced Yield Curve Models</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/60 p-2 rounded-lg shadow-sm border border-indigo-50 text-center">
                <p className="text-xs text-gray-500 truncate">Available Curves</p>
                <p className="text-lg font-bold text-indigo-700">{curves.length}</p>
              </div>
              <div className="bg-white/60 p-2 rounded-lg shadow-sm border border-indigo-50 text-center">
                <p className="text-xs text-gray-500 truncate">Method</p>
                <Badge color="indigo" variant="soft" size="xs" className="mt-1 truncate">
                  {currentCurve ? 
                    getMethodName(currentCurve.curveMethod) : 
                    'Loading...'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-indigo-100">
              <p className="text-xs text-indigo-700 leading-relaxed">
                QuantLib provides advanced mathematical models for accurate yield curve construction, interpolation, and extrapolation using industry-standard techniques.
              </p>
            </div>
          </Card>

          {/* Curve Selection and Parameters */}
          <Card 
            title="Curve Selection" 
            subtitle="Choose yield curve and parameters"
            variant="default"
            accentColor="indigo"
            className="bg-white"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="curve-select" className="block text-xs font-medium text-gray-700 mb-1">
                  Select Yield Curve
                </label>
                <select
                  id="curve-select"
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
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
                <label htmlFor="interpolation-method" className="block text-xs font-medium text-gray-700 mb-1">
                  QuantLib Interpolation Method
                </label>
                <select
                  id="interpolation-method"
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
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
            </div>
          </Card>
          
          {/* Advanced Parameters */}
          <Card 
            title="Advanced Parameters" 
            subtitle="Fine-tune curve modeling"
            variant="default"
            className="bg-white"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    id="show-forward-rates"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={showForwardRates}
                    onChange={(e) => setShowForwardRates(e.target.checked)}
                    disabled={isLoading || (currentCurve && currentCurve.curveType !== 'zero')}
                  />
                  <label htmlFor="show-forward-rates" className="ml-2 block text-xs text-gray-700">
                    Forward Rates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="interpolate"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={interpolate}
                    onChange={(e) => setInterpolate(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="interpolate" className="ml-2 block text-xs text-gray-700">
                    Interpolate Points
                  </label>
                </div>
              </div>
              
              {interpolate && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="resolution" className="block text-xs font-medium text-gray-700">
                      Resolution
                    </label>
                    <span className="text-xs text-gray-500">{resolution} points</span>
                  </div>
                  <input
                    id="resolution"
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={resolution}
                    onChange={(e) => setResolution(parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              {currentCurve && currentCurve.modelParameters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Model Parameters</h4>
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-2">
                    <div className="space-y-1.5">
                      {Object.entries(currentCurve.modelParameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>
                          <span className="font-medium bg-white px-1.5 py-0.5 rounded border border-gray-100">
                            {typeof value === 'number' ? value.toFixed(6) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Curve Information Card */}
          {currentCurve && (
            <Card 
              title="Curve Information" 
              variant="default"
              className="bg-white"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="block text-xs text-gray-500">Type</span>
                  <Badge color={currentCurve.curveType === 'zero' ? 'indigo' : currentCurve.curveType === 'par' ? 'blue' : 'green'} variant="soft" size="sm" className="mt-1">
                    {currentCurve.curveType.charAt(0).toUpperCase() + currentCurve.curveType.slice(1)}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="block text-xs text-gray-500">Currency</span>
                  <span className="font-medium text-gray-900">{currentCurve.currency}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="block text-xs text-gray-500">Market Points</span>
                  <span className="font-medium text-gray-900">{currentCurve.points.length}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="block text-xs text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{currentCurve.date}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-sm transition-colors text-sm font-medium"
                  disabled={isLoading}
                  onClick={() => {
                    // This would regenerate the curve with the selected parameters
                    alert('Curve regeneration would be implemented here');
                  }}
                >
                  Generate Curve
                </button>
              </div>
            </Card>
          )}
        </div>
        
        {/* Main content area - Chart */}
        <div className="col-span-12 lg:col-span-9">
          <Card 
            variant="elevated" 
            className="h-full bg-white" 
            noPadding
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-[600px]">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading yield curve data...</p>
                </div>
              </div>
            ) : currentCurve ? (
              <div className="p-5">
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
              </div>
            ) : (
              <div className="flex justify-center items-center h-[600px]">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-700">No curve data available</p>
                  <p className="mt-2 text-sm text-gray-500">Please select a different curve or try again later.</p>
                </div>
              </div>
            )}
          </Card>
          
          {/* Data table section */}
          <div className="mt-5">
            <Card 
              title="QuantLib Market Data Points" 
              subtitle="Market rates used for yield curve construction"
              variant="default"
              className="bg-white"
              headerAction={
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-2 py-1 text-xs rounded ${tableView === 'compact' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setTableView('compact')}
                  >
                    Compact
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded ${tableView === 'full' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setTableView('full')}
                  >
                    Full
                  </button>
                  {isLoading ? null : currentCurve ? (
                    <button 
                      className="ml-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md flex items-center border border-indigo-100"
                      onClick={() => { 
                        alert('Download functionality would be implemented here');
                      }}
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export CSV
                    </button>
                  ) : null}
                </div>
              }
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : currentCurve ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Tenor
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Years
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Rate (%)
                        </th>
                        {showForwardRates && forwardRates.length > 0 && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Forward Rate (%)
                          </th>
                        )}
                        {tableView === 'full' && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            Type
                          </th>
                        )}
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          ΔRate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentCurve.points.map((point, index) => {
                        const matchingForward = forwardRates.find(fr => fr.tenor === point.tenor);
                        const prevPoint = index > 0 ? currentCurve.points[index - 1] : null;
                        const deltaRate = prevPoint ? (point.rate - prevPoint.rate).toFixed(4) : "—";
                        const isPositiveDelta = prevPoint && point.rate > prevPoint.rate;
                        
                        return (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-indigo-50/30 transition-colors`}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-indigo-700">
                              {point.tenor}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                              {point.years.toFixed(3)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {point.rate.toFixed(4)}
                            </td>
                            {showForwardRates && forwardRates.length > 0 && (
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {matchingForward ? (
                                  <span className={matchingForward.rate > point.rate ? 'text-emerald-600' : 'text-red-600'}>
                                    {matchingForward.rate.toFixed(4)}
                                  </span>
                                ) : '—'}
                              </td>
                            )}
                            {tableView === 'full' && (
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <Badge color="blue" size="xs" variant="soft">Market</Badge>
                              </td>
                            )}
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {prevPoint ? (
                                <span className={isPositiveDelta ? 'text-emerald-600' : 'text-red-600'}>
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
                <div className="text-center py-4 text-gray-500">No curve data available</div>
              )}
              
              {currentCurve && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center text-xs text-gray-500">
                  <div className="mb-2 sm:mb-0">
                    <span className="font-medium">{currentCurve.points.length}</span> market points used to construct the curve
                  </div>
                  <div className="flex space-x-4">
                    <span>Method: <span className="font-medium">{getMethodName(currentCurve.curveMethod)}</span></span>
                    <span>Currency: <span className="font-medium">{currentCurve.currency}</span></span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* QuantLib Education Section */}
      <div className="mt-5">
        <Card 
          title="QuantLib Technical Documentation" 
          subtitle="Learn about the advanced yield curve modeling techniques"
          variant="default"
          className="bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-3 bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-start mb-2">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-1.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-indigo-800">Cubic Spline Interpolation</h4>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Preserves smoothness across data points by ensuring continuous first and second derivatives. Ideal for yield curve modeling where smooth transitions between observed market rates are desired. QuantLib implements natural boundary conditions for stable extrapolation.
              </p>
            </div>
            
            <div className="rounded-lg p-3 bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-start mb-2">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-1.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-indigo-800">Nelson-Siegel-Svensson</h4>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Parametric model using 6 parameters to capture short, medium, and long-term components of term structure dynamics. The NSS model excels at creating smooth and economically reasonable forward rate curves, making it popular among central banks and financial institutions.
              </p>
            </div>
            
            <div className="rounded-lg p-3 bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-start mb-2">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-1.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-indigo-800">Smith-Wilson Method</h4>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Advanced technique that ensures convergence to an ultimate forward rate for extremely long durations. Used by EIOPA and insurance companies for Solvency II calculations, this method provides stable extrapolation beyond the last liquid point while maintaining consistency with observed market rates.
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-1.5 bg-indigo-100 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">QuantLib is an open-source framework for quantitative finance, offering robust tools for yield curve construction, derivatives pricing, and risk management.</span>
              </div>
              <a 
                href="https://www.quantlib.org/docs.shtml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Documentation
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}