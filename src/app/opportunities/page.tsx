'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import Heatmap from '@/components/charts/Heatmap'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { CurrencyPair } from '@/types'

interface OpportunityData {
  baseCurrency: string
  quoteCurrency: string
  basisDivergence: number
  impliedDifferential: number
  actualDifferential: number
  spotRate: number
  futuresRate: number
}

export default function OpportunitiesPage() {
  const [opportunitiesData, setOpportunitiesData] = useState<OpportunityData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [thresholdFilter, setThresholdFilter] = useState<number>(0.0)
  const [sortOption, setSortOption] = useState<string>('divergence')

  // Fetch opportunities data from API
  useEffect(() => {
    setIsLoading(true)
    
    fetch('/api/currency-pairs')
      .then(response => response.json())
      .then((data: CurrencyPair[]) => {
        // Transform currency pair data to format needed for heatmap
        const opportunities = data.map(pair => ({
          baseCurrency: pair.baseCurrency,
          quoteCurrency: pair.quoteCurrency,
          basisDivergence: pair.basisDivergence,
          impliedDifferential: pair.impliedDifferential,
          actualDifferential: pair.actualDifferential,
          spotRate: pair.spotRate,
          futuresRate: pair.futuresRate
        }))
        
        setOpportunitiesData(opportunities)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching opportunities data:', error)
        setIsLoading(false)
      })
  }, [])

  // Filter data based on threshold
  const filteredData = opportunitiesData.filter(
    item => Math.abs(item.basisDivergence) >= thresholdFilter
  )

  // Sort data based on selected option
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case 'divergence':
        return Math.abs(b.basisDivergence) - Math.abs(a.basisDivergence)
      case 'implied':
        return b.impliedDifferential - a.impliedDifferential
      case 'actual':
        return b.actualDifferential - a.actualDifferential
      default:
        return Math.abs(b.basisDivergence) - Math.abs(a.basisDivergence)
    }
  })

  // Get unique base and quote currencies for labels
  const baseCurrencies = Array.from(new Set(opportunitiesData.map(item => item.baseCurrency)))
  const quoteCurrencies = Array.from(new Set(opportunitiesData.map(item => item.quoteCurrency)))
  
  // Create data for heatmap
  const heatmapData = baseCurrencies.flatMap(base => 
    quoteCurrencies.map(quote => {
      const matchingPair = opportunitiesData.find(
        item => item.baseCurrency === base && item.quoteCurrency === quote
      )
      
      // Skip if no matching pair or it's the same currency
      if (!matchingPair || base === quote) return null
      
      return {
        x: quote,
        y: base,
        value: matchingPair.basisDivergence,
        data: matchingPair
      }
    }).filter(Boolean)
  )

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Arbitrage Opportunities</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="threshold" className="text-sm font-medium">
                Min Divergence:
              </label>
              <select
                id="threshold"
                value={thresholdFilter}
                onChange={e => setThresholdFilter(parseFloat(e.target.value))}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
              >
                <option value={0.0}>All</option>
                <option value={0.25}>0.25%+</option>
                <option value={0.5}>0.50%+</option>
                <option value={1.0}>1.00%+</option>
                <option value={1.5}>1.50%+</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm font-medium">
                Sort By:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
              >
                <option value="divergence">Basis Divergence</option>
                <option value="implied">Implied Differential</option>
                <option value="actual">Actual Differential</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="h-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Basis Divergence Heatmap</h2>
              <div className="flex space-x-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Negative</span>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-xs">Neutral</span>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Positive</span>
              </div>
            </div>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : heatmapData.length > 0 ? (
              <Heatmap
                data={heatmapData}
                xAxis="x"
                yAxis="y"
                valueKey="value"
                colors={['#ef4444', '#f3f4f6', '#22c55e']}
                tooltipFormatter={(value) => `${value.toFixed(4)}%`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No data available for the selected filters
              </div>
            )}
          </Card>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Currency Pair
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Spot Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Futures Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Implied Diff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actual Diff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Basis Divergence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Opportunity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Loading opportunities...
                    </td>
                  </tr>
                ) : sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.baseCurrency}/{item.quoteCurrency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.spotRate.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.futuresRate.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {item.impliedDifferential.toFixed(4)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {item.actualDifferential.toFixed(4)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            item.basisDivergence > 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }
                        >
                          {item.basisDivergence.toFixed(4)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {Math.abs(item.basisDivergence) >= 0.5 ? (
                          <Badge color={item.basisDivergence > 0 ? 'green' : 'red'}>
                            {item.basisDivergence > 0 ? 'LONG Futures' : 'SHORT Futures'}
                          </Badge>
                        ) : (
                          <Badge color="gray">No Opportunity</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No opportunities found with current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}