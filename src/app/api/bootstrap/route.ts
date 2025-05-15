import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { 
  BootstrapInput, 
  CalculationSettings, 
  YieldCurveData, 
  YieldCurvePoint 
} from '@/types/quantlib';

// Sample bootstrap inputs
const sampleDeposits: BootstrapInput[] = [
  { type: 'deposit', tenor: '1D', rate: 5.30, includeInCurve: true },
  { type: 'deposit', tenor: '1W', rate: 5.31, includeInCurve: true },
  { type: 'deposit', tenor: '2W', rate: 5.32, includeInCurve: true },
  { type: 'deposit', tenor: '1M', rate: 5.33, includeInCurve: true },
  { type: 'deposit', tenor: '2M', rate: 5.34, includeInCurve: true },
  { type: 'deposit', tenor: '3M', rate: 5.35, includeInCurve: true },
  { type: 'deposit', tenor: '6M', rate: 5.36, includeInCurve: true },
  { type: 'deposit', tenor: '9M', rate: 5.37, includeInCurve: true },
  { type: 'deposit', tenor: '1Y', rate: 5.38, includeInCurve: true },
];

const sampleSwaps: BootstrapInput[] = [
  { type: 'swap', tenor: '2Y', rate: 5.20, includeInCurve: true },
  { type: 'swap', tenor: '3Y', rate: 5.00, includeInCurve: true },
  { type: 'swap', tenor: '4Y', rate: 4.85, includeInCurve: true },
  { type: 'swap', tenor: '5Y', rate: 4.75, includeInCurve: true },
  { type: 'swap', tenor: '6Y', rate: 4.67, includeInCurve: true },
  { type: 'swap', tenor: '7Y', rate: 4.62, includeInCurve: true },
  { type: 'swap', tenor: '8Y', rate: 4.58, includeInCurve: true },
  { type: 'swap', tenor: '9Y', rate: 4.55, includeInCurve: true },
  { type: 'swap', tenor: '10Y', rate: 4.53, includeInCurve: true },
  { type: 'swap', tenor: '12Y', rate: 4.50, includeInCurve: true },
  { type: 'swap', tenor: '15Y', rate: 4.47, includeInCurve: true },
  { type: 'swap', tenor: '20Y', rate: 4.45, includeInCurve: true },
  { type: 'swap', tenor: '25Y', rate: 4.44, includeInCurve: true },
  { type: 'swap', tenor: '30Y', rate: 4.43, includeInCurve: true },
];

// Function to convert tenor to years (simplified)
function tenorToYears(tenor: string): number {
  const unit = tenor.slice(-1);
  const value = parseFloat(tenor.slice(0, -1));
  
  switch (unit) {
    case 'D': return value / 365;
    case 'W': return value / 52;
    case 'M': return value / 12;
    case 'Y': return value;
    default: return 0;
  }
}

// Function to simulate QuantLib bootstrapping (simplified)
function simulateBootstrap(
  deposits: BootstrapInput[],
  swaps: BootstrapInput[],
  settings: CalculationSettings
): YieldCurveData {
  const date = new Date().toISOString().split('T')[0];
  
  // Filter inputs to include only those marked for curve construction
  const filteredDeposits = deposits.filter(d => d.includeInCurve);
  const filteredSwaps = swaps.filter(s => s.includeInCurve);
  
  // Convert inputs to curve points
  const depositPoints: YieldCurvePoint[] = filteredDeposits.map(d => ({
    tenor: d.tenor,
    years: tenorToYears(d.tenor),
    rate: d.rate
  }));
  
  const swapPoints: YieldCurvePoint[] = filteredSwaps.map(s => ({
    tenor: s.tenor,
    years: tenorToYears(s.tenor),
    rate: s.rate
  }));
  
  // Combine and sort by maturity
  const points = [...depositPoints, ...swapPoints].sort((a, b) => a.years - b.years);
  
  // In a real implementation, we would use QuantLib to properly bootstrap the curve
  // Here we just create a simple yield curve from the inputs
  return {
    date,
    name: 'USD OIS Curve (Bootstrapped)',
    curveType: 'zero',
    currency: 'USD',
    curveMethod: 'cubic',
    points
  };
}

export async function GET(request: NextRequest) {
  try {
    // Default calculation settings
    const defaultSettings: CalculationSettings = {
      dayCounter: 'Actual365',
      compounding: 'Continuous',
      frequency: 'Annual',
      businessDayConvention: 'ModifiedFollowing',
      endOfMonth: true
    };
    
    // Get query parameters (not used in this simplified version)
    const searchParams = new URL(request.url).searchParams;
    const method = searchParams.get('method') || 'cubic';
    
    // Simulate bootstrap
    const result = simulateBootstrap(sampleDeposits, sampleSwaps, defaultSettings);
    
    return NextResponse.json({
      curve: result,
      inputs: {
        deposits: sampleDeposits,
        swaps: sampleSwaps,
        settings: defaultSettings
      }
    });
  } catch (error) {
    console.error('Error in bootstrap API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { deposits, swaps, settings } = body;
    
    // Validate inputs
    if (!deposits || !swaps || !settings) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }
    
    // Simulate bootstrap with user-provided inputs
    const result = simulateBootstrap(deposits, swaps, settings);
    
    return NextResponse.json({
      curve: result,
      inputs: {
        deposits,
        swaps,
        settings
      }
    });
  } catch (error) {
    console.error('Error in bootstrap API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}