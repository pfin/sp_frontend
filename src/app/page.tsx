import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

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
        <Card title="Total Pairs" className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="text-center">
            <p className="text-4xl font-bold">{currencyPairs.length}</p>
            <p className="mt-1 text-primary-100">Currency Pairs Monitored</p>
          </div>
        </Card>
        
        <Card title="Arbitrage Opportunities" className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white">
          <div className="text-center">
            <p className="text-4xl font-bold">{currencyPairs.filter(pair => pair.hasOpportunity).length}</p>
            <p className="mt-1 text-secondary-100">Active Opportunities</p>
          </div>
        </Card>
        
        <Card title="Highest Divergence" className="bg-white">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">
              {Math.max(...currencyPairs.map(pair => Math.abs(pair.basisDivergence))).toFixed(2)}
            </p>
            <p className="mt-1 text-neutral-500">Basis Points</p>
          </div>
        </Card>
        
        <Card title="Market Status" className="bg-white">
          <div className="text-center">
            <Badge variant="success" className="text-sm px-3 py-1">
              Markets Open
            </Badge>
            <p className="mt-1 text-neutral-500">Last Update: Just Now</p>
          </div>
        </Card>
      </div>
      
      <Card title="Currency Pairs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Currency Pair
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Near Contract
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Far Contract
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Implied Diff (bp)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actual Diff (bp)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Basis Divergence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {currencyPairs.map((pair) => (
                <tr key={pair.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-700">
                    {pair.displayName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {pair.nearContractPrice.toFixed(5)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {pair.farContractPrice.toFixed(5)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {pair.impliedDifferential.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {pair.actualDifferential.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-700">
                    <span className={pair.basisDivergence > 0.5 ? 'text-green-600' : 'text-neutral-600'}>
                      {pair.basisDivergence.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {pair.hasOpportunity ? (
                      <Badge variant="success">Opportunity</Badge>
                    ) : (
                      <Badge variant="info">Normal</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}