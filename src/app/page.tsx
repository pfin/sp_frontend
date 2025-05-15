'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

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

  return (
    <MainLayout>
      <Header 
        title="Currency Futures Arbitrage Dashboard" 
        subtitle="Monitor implied interest rate differentials and arbitrage opportunities"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-white/20 mr-4">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-primary-100">Currency Pairs Monitored</p>
              <p className="text-3xl font-bold">{currencyPairs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-white/20 mr-4">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-secondary-100">Active Opportunities</p>
              <p className="text-3xl font-bold">{currencyPairs.filter(pair => pair.hasOpportunity).length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mr-4">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Highest Divergence</p>
              <p className="text-3xl font-bold text-primary-600">
                {Math.max(...currencyPairs.map(pair => Math.abs(pair.basisDivergence))).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500">Basis Points</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white hover:shadow-lg transition-all">
          <div className="flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mr-4">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Market Status</p>
              <Badge color="green" className="text-sm px-3 py-1 mt-1">
                Markets Open
              </Badge>
              <p className="text-xs text-neutral-500 mt-1">Last Update: Just Now</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Currency Pairs" className="hover:shadow-lg transition-all">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="table-header">Currency Pair</th>
                <th className="table-header">Near Contract</th>
                <th className="table-header">Far Contract</th>
                <th className="table-header">Implied Diff (bp)</th>
                <th className="table-header">Actual Diff (bp)</th>
                <th className="table-header">Basis Divergence</th>
                <th className="table-header">Status</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {currencyPairs.map((pair, idx) => (
                <tr key={pair.id} className={`hover:bg-primary-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                  <td className="table-cell font-medium text-primary-700">
                    {pair.displayName}
                  </td>
                  <td className="table-cell">
                    {pair.nearContractPrice.toFixed(5)}
                  </td>
                  <td className="table-cell">
                    {pair.farContractPrice.toFixed(5)}
                  </td>
                  <td className="table-cell font-medium text-primary-600">
                    {pair.impliedDifferential.toFixed(2)}
                  </td>
                  <td className="table-cell font-medium text-secondary-600">
                    {pair.actualDifferential.toFixed(2)}
                  </td>
                  <td className="table-cell font-medium">
                    <span className={pair.basisDivergence > 0.5 ? 'text-green-600' : 'text-neutral-600'}>
                      {pair.basisDivergence.toFixed(2)}
                    </span>
                  </td>
                  <td className="table-cell">
                    {pair.hasOpportunity ? (
                      <Badge color="green">Opportunity</Badge>
                    ) : (
                      <Badge color="blue">Normal</Badge>
                    )}
                  </td>
                  <td className="table-cell">
                    <Link href={`/opportunities?pair=${pair.id}`} className="text-primary-600 hover:text-primary-900 font-medium text-sm">
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Link 
            href="/currency-pairs" 
            className="text-primary-600 hover:text-primary-900 flex items-center text-sm font-medium"
          >
            View All Pairs
            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </Card>
    </MainLayout>
  );
}