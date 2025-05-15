import { NextResponse } from 'next/server';
import { CurrencyPair, MarketData } from '@/types';
import { calculateImpliedDifferential, calculateActualDifferential, calculateBasisDivergence } from '@/utils/calculations';

// Mock currency pairs data (in a real application, this would come from a database)
const currencyPairs: CurrencyPair[] = [
  {
    id: 'CADUSD',
    baseCurrency: 'CAD',
    quoteCurrency: 'USD',
    nearContractTicker: 'CDM5 Curncy',
    farContractTicker: 'CDU5 Curncy',
    dayCountConvention: 365,
    basisTicker: 'CDXOQQC BGN Curncy',
    benchmarkRateTicker: {
      base: 'CAONREPO Index',
      quote: 'SOFRRATE Index',
    },
    displayName: 'CAD/USD',
    isActive: true,
  },
  {
    id: 'JPYUSD',
    baseCurrency: 'JPY',
    quoteCurrency: 'USD',
    nearContractTicker: 'JYM5 Curncy',
    farContractTicker: 'JYU5 Curncy',
    dayCountConvention: 360,
    basisTicker: 'JYXOQQC BGN Curncy',
    benchmarkRateTicker: {
      base: 'TONARFXI Index',
      quote: 'SOFRRATE Index',
    },
    displayName: 'JPY/USD',
    isActive: true,
  },
  {
    id: 'EURUSD',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    nearContractTicker: 'ECM5 Curncy',
    farContractTicker: 'ECU5 Curncy',
    dayCountConvention: 360,
    basisTicker: 'EUXOQQC BGN Curncy',
    benchmarkRateTicker: {
      base: 'ESTRON Index',
      quote: 'SOFRRATE Index',
    },
    displayName: 'EUR/USD',
    isActive: true,
  },
  {
    id: 'GBPUSD',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    nearContractTicker: 'BPM5 Curncy',
    farContractTicker: 'BPU5 Curncy',
    dayCountConvention: 365,
    basisTicker: 'BPXOQQC BGN Curncy',
    benchmarkRateTicker: {
      base: 'SONIAOSR Index',
      quote: 'SOFRRATE Index',
    },
    displayName: 'GBP/USD',
    isActive: true,
  },
];

// Mock market data (in a real application, this would come from Yahoo Finance API)
const generateMockMarketData = (): MarketData[] => {
  const now = new Date();
  
  return currencyPairs.map(pair => {
    // Mock contract prices
    let nearContractPrice: number, farContractPrice: number;
    
    switch (pair.id) {
      case 'CADUSD':
        nearContractPrice = 0.7165;
        farContractPrice = 0.71955;
        break;
      case 'JPYUSD':
        nearContractPrice = 0.00665;
        farContractPrice = 0.00668;
        break;
      case 'EURUSD':
        nearContractPrice = 1.0743;
        farContractPrice = 1.0798;
        break;
      case 'GBPUSD':
        nearContractPrice = 1.2654;
        farContractPrice = 1.2702;
        break;
      default:
        nearContractPrice = 1.0;
        farContractPrice = 1.01;
    }
    
    // Mock interest rates
    const baseRate = (pair.id === 'CADUSD') ? 4.0 : 
                    (pair.id === 'JPYUSD') ? 0.5 : 
                    (pair.id === 'EURUSD') ? 3.75 : 3.5;
    const quoteRate = 5.3; // SOFR
    
    // Mock FX basis
    const fxBasis = (pair.id === 'CADUSD') ? 0.08 : 
                   (pair.id === 'JPYUSD') ? 0.13 : 
                   (pair.id === 'EURUSD') ? 0.18 : 0.16;
    
    // Calculate implied differential
    const daysBetween = 91; // Typical difference between quarterly contracts
    const impliedDiffResult = calculateImpliedDifferential(
      nearContractPrice,
      farContractPrice,
      daysBetween,
      pair.dayCountConvention
    );
    
    // Calculate actual differential
    const actualDiff = calculateActualDifferential(baseRate, quoteRate);
    
    // Calculate basis divergence
    const basisDivergence = calculateBasisDivergence(
      impliedDiffResult.value,
      actualDiff,
      fxBasis
    );
    
    return {
      id: `${pair.id}-${now.getTime()}`,
      timestamp: now,
      pairId: pair.id,
      nearContractPrice,
      farContractPrice,
      daysBetween,
      baseRate,
      quoteRate,
      fxBasis,
      impliedDifferential: impliedDiffResult.value,
      actualDifferential: actualDiff,
      basisDivergence,
    };
  });
};

export async function GET() {
  try {
    // Generate mock market data
    const marketData = generateMockMarketData();
    
    // In a real application, you would fetch data from Yahoo Finance API here
    // and perform the calculations with real data
    
    return NextResponse.json({ 
      data: marketData,
      timestamp: new Date(),
      message: 'Market data retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}