import { NextRequest, NextResponse } from 'next/server'
import { CurrencyPair } from '@/types'
import { calculateImpliedDifferential, calculateActualDifferential, calculateBasisDivergence } from '@/utils/calculations'

// Helper to generate random daily fluctuations
function randomFluctuation(magnitude: number = 0.05): number {
  return (Math.random() - 0.5) * magnitude
}

// Generate historical data points
function generateHistoricalData(pair: string, timeframe: string) {
  const days = {
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
  }[timeframe] || 30

  // Base rates for different currency pairs (spot rates)
  const baseRates: Record<string, { spot: number, futuresAdjustment: number, actualRate: number }> = {
    'EURUSD': { spot: 1.08, futuresAdjustment: 0.02, actualRate: 1.5 },
    'USDJPY': { spot: 151.2, futuresAdjustment: 0.01, actualRate: -0.1 },
    'GBPUSD': { spot: 1.26, futuresAdjustment: 0.015, actualRate: 2.0 },
    'USDCHF': { spot: 0.90, futuresAdjustment: 0.005, actualRate: 0.5 },
    'AUDUSD': { spot: 0.66, futuresAdjustment: 0.01, actualRate: 1.8 },
    'USDCAD': { spot: 1.37, futuresAdjustment: 0.008, actualRate: 1.25 },
  }

  // If pair not found in our data, use EURUSD as default
  const base = baseRates[pair] || baseRates['EURUSD']
  
  // Generate timestamps going back from today
  const now = new Date()
  const data = []
  
  // Trend direction: positive or negative for the timeframe
  const trendDirection = Math.random() > 0.5 ? 1 : -1
  const trendMagnitude = Math.random() * 0.5 // Max trend of 0.5% over the period
  
  // Occasional market shock at a random point
  const shockDay = Math.floor(Math.random() * days)
  const hasShock = Math.random() > 0.7 // 30% chance of a shock
  const shockMagnitude = (Math.random() * 0.3 + 0.2) * (Math.random() > 0.5 ? 1 : -1) // 0.2 to 0.5% shock
  
  // Generate data points
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Calculate trend component
    const trendComponent = trendDirection * trendMagnitude * (1 - i / days)
    
    // Calculate shock component (if applicable)
    const shockComponent = (hasShock && i === shockDay) ? shockMagnitude : 0
    
    // Daily random fluctuation
    const dailyFluctuation = randomFluctuation()
    
    // Calculate spot rate with all components
    const spotRate = base.spot * (1 + trendComponent + shockComponent + dailyFluctuation * 0.01)
    
    // Calculate futures rate with slightly different dynamics
    const futuresFluctuation = dailyFluctuation + randomFluctuation(0.02)
    const futuresRate = spotRate * (1 + base.futuresAdjustment/100 + futuresFluctuation * 0.01)
    
    // Calculate actual rate with its own fluctuation
    const actualRateFluctuation = randomFluctuation(0.03)
    const actualRate = base.actualRate + actualRateFluctuation
    
    // Days to expiry (assume standard 90-day futures contract)
    const daysToExpiry = 90
    
    // Calculate differentials
    const impliedDifferential = calculateImpliedDifferential(spotRate, futuresRate, daysToExpiry)
    const actualDifferential = calculateActualDifferential(actualRate)
    const basisDivergence = calculateBasisDivergence(impliedDifferential, actualDifferential)
    
    data.push({
      date: date.toISOString().split('T')[0],
      impliedDifferential,
      actualDifferential,
      basisDivergence
    })
  }
  
  return data
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pair = searchParams.get('pair') || 'EURUSD'
    const timeframe = searchParams.get('timeframe') || '1M'
    
    // Generate mock historical data
    const data = generateHistoricalData(pair, timeframe)
    
    // Add delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating historical data:', error)
    return NextResponse.json({ error: 'Failed to generate historical data' }, { status: 500 })
  }
}