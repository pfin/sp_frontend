'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import LineChart from '@/components/charts/LineChart'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { CurrencyPair } from '@/types'

interface HistoricalDataPoint {
  date: string
  impliedDifferential: number
  actualDifferential: number
  basisDivergence: number
}

export default function HistoricalPage() {
  const [selectedPair, setSelectedPair] = useState<string>('EURUSD')
  const [timeFrame, setTimeFrame] = useState<string>('1M')
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([])

  useEffect(() => {
    // Fetch currency pairs
    fetch('/api/currency-pairs')
      .then((res) => res.json())
      .then((data) => setCurrencyPairs(data))
      .catch((error) => console.error('Error fetching currency pairs:', error))

    // Fetch historical data based on selected pair and timeframe
    setIsLoading(true)
    fetch(`/api/historical-data?pair=${selectedPair}&timeframe=${timeFrame}`)
      .then((res) => res.json())
      .then((data) => {
        setHistoricalData(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching historical data:', error)
        setIsLoading(false)
      })
  }, [selectedPair, timeFrame])

  const timeFrameOptions = [
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historical Data Analysis</h1>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="pair-select" className="text-sm font-medium">
                Currency Pair:
              </label>
              <select
                id="pair-select"
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm"
              >
                {currencyPairs.map((pair) => (
                  <option key={pair.symbol} value={pair.symbol}>
                    {pair.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="timeframe-select" className="text-sm font-medium">
                Time Frame:
              </label>
              <div className="flex space-x-1">
                {timeFrameOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeFrame(option.value)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      timeFrame === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-3 h-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Differential Trends</h2>
              <div className="flex space-x-2">
                <Badge color="purple">Implied</Badge>
                <Badge color="blue">Actual</Badge>
                <Badge color="amber">Divergence</Badge>
              </div>
            </div>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <LineChart
                data={historicalData}
                xAxis="date"
                series={[
                  { name: 'Implied Differential', dataKey: 'impliedDifferential', color: '#9333ea' },
                  { name: 'Actual Differential', dataKey: 'actualDifferential', color: '#3b82f6' },
                  { name: 'Basis Divergence', dataKey: 'basisDivergence', color: '#f59e0b' },
                ]}
                yAxisLabel="Rate (%)"
                xAxisLabel="Date"
                tooltipFormatter={(value) => `${value.toFixed(4)}%`}
              />
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h2 className="text-lg font-medium mb-2">Statistics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Implied Differential:</span>
                <span className="font-medium">
                  {isLoading
                    ? '...'
                    : `${(
                        historicalData.reduce((sum, item) => sum + item.impliedDifferential, 0) / historicalData.length
                      ).toFixed(4)}%`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max Divergence:</span>
                <span className="font-medium">
                  {isLoading
                    ? '...'
                    : `${Math.max(...historicalData.map((item) => Math.abs(item.basisDivergence))).toFixed(4)}%`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
                <span className="font-medium">
                  {isLoading
                    ? '...'
                    : (() => {
                        const values = historicalData.map((item) => item.impliedDifferential)
                        const mean = values.reduce((sum, val) => sum + val, 0) / values.length
                        const variance =
                          values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
                        return `${Math.sqrt(variance).toFixed(4)}%`
                      })()}
                </span>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-medium mb-2">Current Status</h2>
            <div className="space-y-2">
              {!isLoading && historicalData.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latest Implied Differential:</span>
                    <span className="font-medium">{historicalData[historicalData.length - 1].impliedDifferential.toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latest Actual Differential:</span>
                    <span className="font-medium">{historicalData[historicalData.length - 1].actualDifferential.toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latest Divergence:</span>
                    <span 
                      className={`font-medium ${
                        Math.abs(historicalData[historicalData.length - 1].basisDivergence) > 0.1 
                          ? 'text-amber-500' 
                          : 'text-green-500'
                      }`}
                    >
                      {historicalData[historicalData.length - 1].basisDivergence.toFixed(4)}%
                    </span>
                  </div>
                </>
              )}
              {(isLoading || historicalData.length === 0) && (
                <div className="text-gray-500">Loading data...</div>
              )}
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-medium mb-2">Trading Signals</h2>
            <div className="space-y-2">
              {!isLoading && historicalData.length > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        Math.abs(historicalData[historicalData.length - 1].basisDivergence) > 0.15
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <span>Trading opportunity</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-600 dark:text-gray-400">Signal strength:</span>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(
                            Math.abs(historicalData[historicalData.length - 1].basisDivergence) * 200, 
                            100
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-medium">Recommendation:</span>
                    <p className="text-sm mt-1">
                      {Math.abs(historicalData[historicalData.length - 1].basisDivergence) > 0.15
                        ? `Consider ${
                            historicalData[historicalData.length - 1].basisDivergence > 0
                              ? 'short futures / long spot'
                              : 'long futures / short spot'
                          } for ${selectedPair}`
                        : 'No significant arbitrage opportunity at this time'}
                    </p>
                  </div>
                </>
              )}
              {(isLoading || historicalData.length === 0) && (
                <div className="text-gray-500">Loading signals...</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}