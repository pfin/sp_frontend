'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useState, useEffect } from 'react';

export default function CurrencyPairsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currencyPairs, setCurrencyPairs] = useState([
    {
      id: 'EURUSD',
      displayName: 'EUR/USD',
      baseCurrency: 'EUR',
      quoteCurrency: 'USD',
      nearContractPrice: 1.0782,
      farContractPrice: 1.0801,
      impliedDifferential: 0.38,
      actualDifferential: 0.42,
      basisDivergence: -0.04,
      spotRate: 1.0775,
      futuresRate: 1.0801,
      hasOpportunity: false,
    },
    {
      id: 'GBPUSD',
      displayName: 'GBP/USD',
      baseCurrency: 'GBP',
      quoteCurrency: 'USD',
      nearContractPrice: 1.2643,
      farContractPrice: 1.2698,
      impliedDifferential: 0.88,
      actualDifferential: 0.76,
      basisDivergence: 0.12,
      spotRate: 1.2635,
      futuresRate: 1.2698,
      hasOpportunity: false,
    },
    {
      id: 'USDJPY',
      displayName: 'USD/JPY',
      baseCurrency: 'USD',
      quoteCurrency: 'JPY',
      nearContractPrice: 152.68,
      farContractPrice: 153.12,
      impliedDifferential: 0.58,
      actualDifferential: -0.12,
      basisDivergence: 0.70,
      spotRate: 152.50,
      futuresRate: 153.12,
      hasOpportunity: true,
    },
    {
      id: 'AUDUSD',
      displayName: 'AUD/USD',
      baseCurrency: 'AUD',
      quoteCurrency: 'USD',
      nearContractPrice: 0.6545,
      farContractPrice: 0.6559,
      impliedDifferential: 0.44,
      actualDifferential: 0.42,
      basisDivergence: 0.02,
      spotRate: 0.6538,
      futuresRate: 0.6559,
      hasOpportunity: false,
    },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: 'Currency Pairs', href: '/currency-pairs', current: true }
  ];

  return (
    <MainLayout>
      <Header 
        title="Currency Pairs" 
        subtitle="Monitor and analyze currency exchange pairs"
        breadcrumbs={breadcrumbs}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-4">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pairs Monitored</p>
              <p className="text-2xl font-bold text-neutral-900">{currencyPairs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mr-4">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10.188a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h10.188a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Trading Volume</p>
              <p className="text-2xl font-bold text-neutral-900">$1.7B</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mr-4">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Market Status</p>
              <div className="mt-1">
                <Badge color="green">Open</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Currency Pairs" className="hover:shadow-lg transition-all">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Currency Pair</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Exchange Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Futures Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Implied Diff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actual Diff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Basis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {currencyPairs.map((pair, idx) => (
                  <tr key={pair.id} className={`hover:bg-primary-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-700">
                      {pair.displayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {pair.spotRate.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {pair.futuresRate.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      {pair.impliedDifferential.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-600">
                      {pair.actualDifferential.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={pair.basisDivergence > 0 ? 'text-green-600' : 'text-red-600'}>
                        {pair.basisDivergence.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {Math.abs(pair.basisDivergence) > 0.5 ? (
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
        )}
      </Card>
    </MainLayout>
  );
}