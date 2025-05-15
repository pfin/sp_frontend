import { NextResponse } from 'next/server'
import { CurrencyPair } from '@/types'

const currencyPairs: CurrencyPair[] = [
  {
    symbol: 'EURUSD',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    spotRate: 1.08,
    futuresRate: 1.085,
    daysToExpiry: 90,
    impliedDifferential: 1.86,
    actualDifferential: 1.5,
    basisDivergence: 0.36,
    lastUpdated: new Date().toISOString(),
    status: 'normal' 
  },
  {
    symbol: 'USDJPY',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    spotRate: 151.2,
    futuresRate: 151.9,
    daysToExpiry: 90,
    impliedDifferential: 1.85,
    actualDifferential: -0.1,
    basisDivergence: 1.95, 
    lastUpdated: new Date().toISOString(),
    status: 'opportunity'
  },
  {
    symbol: 'GBPUSD',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    spotRate: 1.26,
    futuresRate: 1.268,
    daysToExpiry: 90,
    impliedDifferential: 2.54,
    actualDifferential: 2.0,
    basisDivergence: 0.54,
    lastUpdated: new Date().toISOString(),
    status: 'opportunity'
  },
  {
    symbol: 'USDCHF',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    spotRate: 0.90,
    futuresRate: 0.904,
    daysToExpiry: 90,
    impliedDifferential: 1.78,
    actualDifferential: 0.5,
    basisDivergence: 1.28,
    lastUpdated: new Date().toISOString(),
    status: 'opportunity'
  },
  {
    symbol: 'AUDUSD',
    baseCurrency: 'AUD',
    quoteCurrency: 'USD',
    spotRate: 0.66,
    futuresRate: 0.664,
    daysToExpiry: 90,
    impliedDifferential: 2.45,
    actualDifferential: 1.8,
    basisDivergence: 0.65,
    lastUpdated: new Date().toISOString(),
    status: 'opportunity'
  },
  {
    symbol: 'USDCAD',
    baseCurrency: 'USD',
    quoteCurrency: 'CAD',
    spotRate: 1.37,
    futuresRate: 1.376,
    daysToExpiry: 90,
    impliedDifferential: 1.76,
    actualDifferential: 1.25,
    basisDivergence: 0.51,
    lastUpdated: new Date().toISOString(),
    status: 'opportunity'
  }
]

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return NextResponse.json(currencyPairs)
}