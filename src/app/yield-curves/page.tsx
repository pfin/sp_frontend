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
        subtitle="Build, visualize and analyze yield curves using QuantLib"
        breadcrumbs={breadcrumbs}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Curves Available</p>
              <p className="text-2xl font-bold text-neutral-900">{curves.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Current Curve</p>
              <p className="text-xl font-bold text-neutral-900 truncate max-w-[180px]">
                {currentCurve ? currentCurve.name : 'Loading...'}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Model</p>
              <p className="text-xl font-bold text-neutral-900">
                {currentCurve ? getMethodName(currentCurve.curveMethod) : 'Loading...'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="hover:shadow-lg transition-all h-full">
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
          <Card className="hover:shadow-lg transition-all mb-6">
            <h3 className="text-lg font-medium mb-4">Curve Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="curve-select" className="block text-sm font-medium text-neutral-700 mb-1">
                  Select Curve
                </label>
                <select
                  id="curve-select"
                  className="w-full border border-neutral-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
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
                  className="w-full border border-neutral-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
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
              
              <div className="flex items-center">
                <input
                  id="show-forward-rates"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  checked={showForwardRates}
                  onChange={(e) => setShowForwardRates(e.target.checked)}
                  disabled={isLoading || (currentCurve && currentCurve.curveType !== 'zero')}
                />
                <label htmlFor="show-forward-rates" className="ml-2 block text-sm text-neutral-700">
                  Show Forward Rates
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="interpolate"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  checked={interpolate}
                  onChange={(e) => setInterpolate(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="interpolate" className="ml-2 block text-sm text-neutral-700">
                  Apply Interpolation
                </label>
              </div>
              
              {interpolate && (
                <div>
                  <label htmlFor="resolution" className="block text-sm font-medium text-neutral-700 mb-1">
                    Resolution: {resolution} points
                  </label>
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
              
              <button
                className="w-full mt-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50"
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
          </Card>
          
          {currentCurve && currentCurve.modelParameters && (
            <Card className="hover:shadow-lg transition-all">
              <h3 className="text-lg font-medium mb-4">Model Parameters</h3>
              
              <div className="space-y-2">
                {Object.entries(currentCurve.modelParameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-neutral-600">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span className="font-medium">
                      {typeof value === 'number' ? value.toFixed(4) : value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-medium mb-2">Curve Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Type:</span>
                    <Badge color="primary">
                      {currentCurve.curveType.charAt(0).toUpperCase() + currentCurve.curveType.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Points:</span>
                    <span>{currentCurve.points.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Currency:</span>
                    <span>{currentCurve.currency}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Card className="hover:shadow-lg transition-all">
          <h3 className="text-lg font-medium mb-4">Curve Data</h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : currentCurve ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Tenor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Years
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Rate (%)
                    </th>
                    {showForwardRates && forwardRates.length > 0 && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Forward Rate (%)
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {currentCurve.points.map((point, index) => {
                    const matchingForward = forwardRates.find(fr => fr.tenor === point.tenor);
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary-700">
                          {point.tenor}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-700">
                          {point.years.toFixed(3)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-700">
                          {point.rate.toFixed(4)}
                        </td>
                        {showForwardRates && forwardRates.length > 0 && (
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-700">
                            {matchingForward ? matchingForward.rate.toFixed(4) : '-'}
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
        </Card>
      </div>
    </MainLayout>
  );
}