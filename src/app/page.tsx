'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

// Import YieldCurveChart component to showcase QuantLib functionality
import YieldCurveChart from '@/components/charts/YieldCurveChart';

export default function Home() {
  // Sample data for the dashboard
  const currencyPairs = [
    {
      id: 'CADUSD',
      displayName: 'CAD/USD',
      nearContractPrice: 0.7165,
      farContractPrice: 0.71955,
      daysBetween: 91,
      impliedDifferential: 1.67,
      actualDifferential: 0.91,
      basisDivergence: 0.68,
      hasOpportunity: true,
    },
    {
      id: 'JPYUSD',
      displayName: 'JPY/USD',
      nearContractPrice: 0.00665,
      farContractPrice: 0.00668,
      daysBetween: 91,
      impliedDifferential: 1.81,
      actualDifferential: 1.78,
      basisDivergence: 0.03,
      hasOpportunity: false,
    },
    {
      id: 'EURUSD',
      displayName: 'EUR/USD',
      nearContractPrice: 1.0743,
      farContractPrice: 1.0798,
      daysBetween: 91,
      impliedDifferential: 2.05,
      actualDifferential: 1.85,
      basisDivergence: 0.20,
      hasOpportunity: false,
    },
    {
      id: 'GBPUSD',
      displayName: 'GBP/USD',
      nearContractPrice: 1.2654,
      farContractPrice: 1.2702,
      daysBetween: 91,
      impliedDifferential: 1.52,
      actualDifferential: 1.29,
      basisDivergence: 0.23,
      hasOpportunity: false,
    },
  ];

  // Sample yield curve data to showcase QuantLib functionality
  const sampleYieldCurveData = {
    date: '2023-05-15',
    name: 'USD OIS Curve',
    curveType: 'zero',
    currency: 'USD',
    curveMethod: 'cubic',
    points: [
      { tenor: '1D', years: 0.00274, rate: 5.31 },
      { tenor: '1W', years: 0.01918, rate: 5.33 },
      { tenor: '2W', years: 0.03836, rate: 5.34 },
      { tenor: '1M', years: 0.08493, rate: 5.35 },
      { tenor: '3M', years: 0.25479, rate: 5.36 },
      { tenor: '6M', years: 0.50685, rate: 5.31 },
      { tenor: '1Y', years: 1.0, rate: 4.95 },
      { tenor: '2Y', years: 2.0, rate: 4.42 },
      { tenor: '3Y', years: 3.0, rate: 4.06 },
      { tenor: '5Y', years: 5.0, rate: 3.85 },
      { tenor: '7Y', years: 7.0, rate: 3.83 },
      { tenor: '10Y', years: 10.0, rate: 3.91 },
      { tenor: '15Y', years: 15.0, rate: 4.01 },
      { tenor: '20Y', years: 20.0, rate: 4.09 },
      { tenor: '30Y', years: 30.0, rate: 4.05 },
    ],
  };

  // Sample forward rates data
  const forwardRates = [
    { tenor: '1D', years: 0.00274, rate: 5.31 },
    { tenor: '1W', years: 0.01918, rate: 5.33 },
    { tenor: '2W', years: 0.03836, rate: 5.34 },
    { tenor: '1M', years: 0.08493, rate: 5.35 },
    { tenor: '3M', years: 0.25479, rate: 5.39 },
    { tenor: '6M', years: 0.50685, rate: 5.33 },
    { tenor: '1Y', years: 1.0, rate: 4.65 },
    { tenor: '2Y', years: 2.0, rate: 3.90 },
    { tenor: '3Y', years: 3.0, rate: 3.45 },
    { tenor: '5Y', years: 5.0, rate: 3.70 },
    { tenor: '7Y', years: 7.0, rate: 3.82 },
    { tenor: '10Y', years: 10.0, rate: 4.10 },
    { tenor: '15Y', years: 15.0, rate: 4.15 },
    { tenor: '20Y', years: 20.0, rate: 4.18 },
    { tenor: '30Y', years: 30.0, rate: 4.01 },
  ];

  // Sample quantitative models available
  const quantModels = [
    {
      id: 'nss',
      name: 'Nelson-Siegel-Svensson',
      type: 'Yield Curve',
      description: 'Parametric model for fitting the term structure',
      parameters: 6
    },
    {
      id: 'smithwilson',
      name: 'Smith-Wilson',
      type: 'Yield Curve',
      description: 'Method with ultimate forward rate convergence',
      parameters: 2
    },
    {
      id: 'cubic_spline',
      name: 'Cubic Spline',
      type: 'Interpolation',
      description: 'Smooth piecewise cubic polynomial',
      parameters: 'n+2'
    },
    {
      id: 'bootstrap',
      name: 'Bootstrap',
      type: 'Term Structure',
      description: 'Strip zero rates from market instruments',
      parameters: 'n'
    }
  ];

  // Curve building instruments
  const instruments = [
    { name: 'OIS 1M', rate: 5.35, includeInCurve: true },
    { name: 'OIS 3M', rate: 5.36, includeInCurve: true },
    { name: 'OIS 6M', rate: 5.31, includeInCurve: true },
    { name: 'OIS 1Y', rate: 4.95, includeInCurve: true },
    { name: 'OIS 2Y', rate: 4.42, includeInCurve: true },
    { name: 'OIS 5Y', rate: 3.85, includeInCurve: true },
    { name: 'OIS 10Y', rate: 3.91, includeInCurve: true },
    { name: 'OIS 30Y', rate: 4.05, includeInCurve: true }
  ];

  return (
    <MainLayout>
      <Header 
        title="Currency Futures Arbitrage Dashboard" 
        subtitle="Powered by QuantLib for advanced term structure modeling and interest rate analytics"
      />
      
      {/* QuantLib Feature Highlight */}
      <div className="mb-6 bg-gradient-to-r from-primary-100/80 to-primary-50/80 rounded-xl p-4 border border-primary-200">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 mb-4 lg:mb-0 lg:pr-6">
            <h2 className="text-xl font-semibold text-primary-800 mb-2">QuantLib Integration</h2>
            <p className="text-sm text-neutral-700 mb-3">
              Use industry-standard quantitative finance models powered by QuantLib for advanced yield curve construction, 
              bootstrapping, interpolation, and term structure analysis.
            </p>
            <div className="flex space-x-2">
              <Link 
                href="/yield-curves/page-redesigned" 
                className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded shadow-sm transition-colors"
              >
                Yield Curve Builder
              </Link>
              <Link 
                href="/historical" 
                className="text-sm bg-white border border-primary-300 hover:bg-primary-50 text-primary-700 px-3 py-1.5 rounded shadow-sm transition-colors"
              >
                Historical Data
              </Link>
            </div>
          </div>
          <div className="lg:w-2/3 bg-white p-3 rounded-lg shadow-sm">
            <YieldCurveChart 
              data={sampleYieldCurveData.points}
              title="USD OIS Curve"
              height={220}
              showGrid={true}
              curveType="zero"
              curveMethod="cubic"
              showForwardCurve={true}
              forwardRates={forwardRates}
              highlightArea={{
                start: 1,
                end: 5,
                label: '1Y-5Y Segment'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:shadow transition-all" compact>
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/20 mr-3">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-primary-100">Currency Pairs</p>
              <p className="text-2xl font-bold">{currencyPairs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white hover:shadow transition-all" compact>
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/20 mr-3">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-secondary-100">Active Opportunities</p>
              <p className="text-2xl font-bold">{currencyPairs.filter(pair => pair.hasOpportunity).length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow transition-all" compact>
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-3">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Highest Divergence</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.max(...currencyPairs.map(pair => Math.abs(pair.basisDivergence))).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500">Basis Points</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow transition-all" compact>
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mr-3">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Market Status</p>
              <Badge color="green" className="text-xs px-2 py-0.5 mt-1">
                Markets Open
              </Badge>
              <p className="text-xs text-neutral-500 mt-1">Last Update: Just Now</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main content with 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left column: currency pairs */}
        <div className="lg:col-span-2">
          <Card 
            title="Currency Pairs" 
            subtitle="Cross-currency basis spreads and implied rates"
            headerAction={
              <Link 
                href="/currency-pairs" 
                className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 px-2 py-1 rounded"
              >
                View All
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Pair</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Near</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Far</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Implied Diff</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actual Diff</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {currencyPairs.map((pair, idx) => (
                    <tr key={pair.id} className={`hover:bg-primary-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary-700">
                        {pair.displayName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-700">
                        {pair.nearContractPrice.toFixed(5)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-700">
                        {pair.farContractPrice.toFixed(5)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary-600">
                        {pair.impliedDifferential.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-secondary-600">
                        {pair.actualDifferential.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {pair.hasOpportunity ? (
                          <Badge color="green">Opportunity</Badge>
                        ) : (
                          <Badge color="blue">Normal</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Right column: QuantLib models and tools */}
        <div className="lg:col-span-1">
          <Card 
            title="QuantLib Models" 
            subtitle="Available quantitative models"
            className="mb-6"
          >
            <ul className="divide-y divide-neutral-100">
              {quantModels.map(model => (
                <li key={model.id} className="py-2.5 flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-xs font-bold">{model.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{model.name}</p>
                    <p className="text-xs text-neutral-500">{model.description}</p>
                    <div className="flex mt-1 space-x-2">
                      <Badge color="primary" className="text-xs px-1.5 py-0.5">{model.type}</Badge>
                      <Badge color="neutral" className="text-xs px-1.5 py-0.5">{model.parameters} params</Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <Link
                href="/yield-curves/page-redesigned"
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center justify-center w-full bg-primary-50 hover:bg-primary-100 py-2 px-3 rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Build Yield Curves
              </Link>
            </div>
          </Card>
          
          <Card 
            title="Market Instruments" 
            subtitle="Used for curve construction"
          >
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-100">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">Instrument</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">Rate (%)</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {instruments.map((instrument, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                      <td className="px-3 py-1.5 text-sm font-medium text-neutral-700">
                        {instrument.name}
                      </td>
                      <td className="px-3 py-1.5 text-sm text-neutral-700">
                        {instrument.rate.toFixed(2)}
                      </td>
                      <td className="px-3 py-1.5">
                        <Badge color={instrument.includeInCurve ? 'green' : 'neutral'} className="text-xs">
                          {instrument.includeInCurve ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Quick links to key features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <Link href="/yield-curves/page-redesigned" className="group">
          <Card compact className="hover:border-primary-300 hover:bg-primary-50/50 group-hover:shadow transition-all">
            <div className="flex items-center">
              <div className="h-9 w-9 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">Yield Curve Builder</h3>
                <p className="text-xs text-neutral-500">Advanced QuantLib modeling tools</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/historical" className="group">
          <Card compact className="hover:border-primary-300 hover:bg-primary-50/50 group-hover:shadow transition-all">
            <div className="flex items-center">
              <div className="h-9 w-9 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">Historical Analysis</h3>
                <p className="text-xs text-neutral-500">Time series and spread evolution</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/opportunities" className="group">
          <Card compact className="hover:border-primary-300 hover:bg-primary-50/50 group-hover:shadow transition-all">
            <div className="flex items-center">
              <div className="h-9 w-9 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">Arbitrage Opportunities</h3>
                <p className="text-xs text-neutral-500">Real-time basis opportunities</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/currency-pairs" className="group">
          <Card compact className="hover:border-primary-300 hover:bg-primary-50/50 group-hover:shadow transition-all">
            <div className="flex items-center">
              <div className="h-9 w-9 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">Currency Pairs</h3>
                <p className="text-xs text-neutral-500">Monitored cross-currency spreads</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </MainLayout>
  );
}