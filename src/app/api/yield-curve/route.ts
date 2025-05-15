import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Types for yield curve data
interface YieldCurvePoint {
  tenor: string;
  years: number;
  rate: number;
}

interface YieldCurveData {
  date: string;
  name: string;
  curveType: 'zero' | 'par' | 'forward';
  currency: string;
  points: YieldCurvePoint[];
  curveMethod: 'cubic' | 'linear' | 'nss' | 'smithwilson';
  modelParameters?: {
    [key: string]: number;
  };
}

// Sample yield curve data
const sampleCurveData: YieldCurveData[] = [
  {
    date: new Date().toISOString().split('T')[0],
    name: 'USD OIS Curve',
    curveType: 'zero',
    currency: 'USD',
    curveMethod: 'cubic',
    points: [
      { tenor: '1D', years: 1/365, rate: 5.25 },
      { tenor: '1W', years: 7/365, rate: 5.27 },
      { tenor: '1M', years: 1/12, rate: 5.30 },
      { tenor: '3M', years: 3/12, rate: 5.33 },
      { tenor: '6M', years: 6/12, rate: 5.31 },
      { tenor: '1Y', years: 1, rate: 5.23 },
      { tenor: '2Y', years: 2, rate: 4.91 },
      { tenor: '3Y', years: 3, rate: 4.70 },
      { tenor: '5Y', years: 5, rate: 4.51 },
      { tenor: '7Y', years: 7, rate: 4.42 },
      { tenor: '10Y', years: 10, rate: 4.38 },
      { tenor: '15Y', years: 15, rate: 4.32 },
      { tenor: '20Y', years: 20, rate: 4.31 },
      { tenor: '30Y', years: 30, rate: 4.30 },
    ]
  },
  {
    date: new Date().toISOString().split('T')[0],
    name: 'EUR OIS Curve',
    curveType: 'zero',
    currency: 'EUR',
    curveMethod: 'cubic',
    points: [
      { tenor: '1D', years: 1/365, rate: 3.65 },
      { tenor: '1W', years: 7/365, rate: 3.68 },
      { tenor: '1M', years: 1/12, rate: 3.71 },
      { tenor: '3M', years: 3/12, rate: 3.72 },
      { tenor: '6M', years: 6/12, rate: 3.67 },
      { tenor: '1Y', years: 1, rate: 3.60 },
      { tenor: '2Y', years: 2, rate: 3.33 },
      { tenor: '3Y', years: 3, rate: 3.07 },
      { tenor: '5Y', years: 5, rate: 2.87 },
      { tenor: '7Y', years: 7, rate: 2.80 },
      { tenor: '10Y', years: 10, rate: 2.83 },
      { tenor: '15Y', years: 15, rate: 2.95 },
      { tenor: '20Y', years: 20, rate: 3.01 },
      { tenor: '30Y', years: 30, rate: 3.00 },
    ]
  },
  {
    date: new Date().toISOString().split('T')[0],
    name: 'USD Treasury Curve',
    curveType: 'par',
    currency: 'USD',
    curveMethod: 'nss',
    points: [
      { tenor: '1M', years: 1/12, rate: 5.28 },
      { tenor: '3M', years: 3/12, rate: 5.30 },
      { tenor: '6M', years: 6/12, rate: 5.25 },
      { tenor: '1Y', years: 1, rate: 5.13 },
      { tenor: '2Y', years: 2, rate: 4.83 },
      { tenor: '3Y', years: 3, rate: 4.59 },
      { tenor: '5Y', years: 5, rate: 4.42 },
      { tenor: '7Y', years: 7, rate: 4.37 },
      { tenor: '10Y', years: 10, rate: 4.32 },
      { tenor: '20Y', years: 20, rate: 4.28 },
      { tenor: '30Y', years: 30, rate: 4.27 },
    ],
    modelParameters: {
      beta0: 0.0456,
      beta1: -0.0058,
      beta2: -0.0297,
      beta3: -0.0201,
      tau1: 2.3,
      tau2: 9.7
    }
  },
  {
    date: new Date().toISOString().split('T')[0],
    name: 'Nelson-Siegel-Svensson Curve',
    curveType: 'zero',
    currency: 'USD',
    curveMethod: 'nss',
    points: [
      { tenor: '1M', years: 1/12, rate: 5.29 },
      { tenor: '3M', years: 3/12, rate: 5.32 },
      { tenor: '6M', years: 6/12, rate: 5.30 },
      { tenor: '1Y', years: 1, rate: 5.22 },
      { tenor: '2Y', years: 2, rate: 4.89 },
      { tenor: '3Y', years: 3, rate: 4.68 },
      { tenor: '5Y', years: 5, rate: 4.48 },
      { tenor: '7Y', years: 7, rate: 4.40 },
      { tenor: '10Y', years: 10, rate: 4.35 },
      { tenor: '15Y', years: 15, rate: 4.31 },
      { tenor: '20Y', years: 20, rate: 4.30 },
      { tenor: '30Y', years: 30, rate: 4.29 },
    ],
    modelParameters: {
      beta0: 0.0432,
      beta1: 0.0097,
      beta2: -0.0379,
      beta3: -0.0158,
      tau1: 1.8,
      tau2: 8.6
    }
  },
  {
    date: new Date().toISOString().split('T')[0],
    name: 'Smith-Wilson Curve',
    curveType: 'zero',
    currency: 'EUR',
    curveMethod: 'smithwilson',
    points: [
      { tenor: '1M', years: 1/12, rate: 3.70 },
      { tenor: '3M', years: 3/12, rate: 3.73 },
      { tenor: '6M', years: 6/12, rate: 3.69 },
      { tenor: '1Y', years: 1, rate: 3.62 },
      { tenor: '2Y', years: 2, rate: 3.36 },
      { tenor: '3Y', years: 3, rate: 3.09 },
      { tenor: '5Y', years: 5, rate: 2.88 },
      { tenor: '7Y', years: 7, rate: 2.81 },
      { tenor: '10Y', years: 10, rate: 2.84 },
      { tenor: '15Y', years: 15, rate: 2.97 },
      { tenor: '20Y', years: 20, rate: 3.03 },
      { tenor: '30Y', years: 30, rate: 3.01 },
      { tenor: '40Y', years: 40, rate: 2.92 },
      { tenor: '50Y', years: 50, rate: 2.85 },
    ],
    modelParameters: {
      alpha: 0.15,
      ultimateForwardRate: 3.5
    }
  }
];

// Function to build forward rates from zero rates
function calculateForwardRates(zeroPoints: YieldCurvePoint[]): YieldCurvePoint[] {
  const forwardPoints: YieldCurvePoint[] = [];
  
  // Sort by years (maturity)
  const sortedPoints = [...zeroPoints].sort((a, b) => a.years - b.years);
  
  // For the first point, the forward rate is the same as the zero rate
  forwardPoints.push({ ...sortedPoints[0] });
  
  // Calculate forward rates for the rest of the points
  for (let i = 1; i < sortedPoints.length; i++) {
    const t1 = sortedPoints[i-1].years;
    const t2 = sortedPoints[i].years;
    const r1 = sortedPoints[i-1].rate / 100; // Convert to decimal
    const r2 = sortedPoints[i].rate / 100; // Convert to decimal
    
    // Calculate the forward rate between t1 and t2
    const forwardRate = ((Math.pow(1 + r2, t2) / Math.pow(1 + r1, t1)) - 1) / (t2 - t1);
    
    forwardPoints.push({
      tenor: sortedPoints[i].tenor,
      years: sortedPoints[i].years,
      rate: forwardRate * 100 // Convert back to percentage
    });
  }
  
  return forwardPoints;
}

// Function to interpolate curve points
function interpolateCurve(points: YieldCurvePoint[], method: string, resolution: number = 100): YieldCurvePoint[] {
  // Get min and max years
  const sortedPoints = [...points].sort((a, b) => a.years - b.years);
  const minYears = sortedPoints[0].years;
  const maxYears = sortedPoints[sortedPoints.length - 1].years;
  
  const step = (maxYears - minYears) / resolution;
  const interpolatedPoints: YieldCurvePoint[] = [];
  
  // Simple implementation of linear interpolation
  // In a real app, we would implement cubic spline, Smith-Wilson, etc.
  for (let i = 0; i <= resolution; i++) {
    const years = minYears + i * step;
    
    // Find surrounding points
    let lower = sortedPoints[0];
    let upper = sortedPoints[sortedPoints.length - 1];
    
    for (let j = 0; j < sortedPoints.length - 1; j++) {
      if (sortedPoints[j].years <= years && sortedPoints[j+1].years >= years) {
        lower = sortedPoints[j];
        upper = sortedPoints[j+1];
        break;
      }
    }
    
    // Interpolate
    let rate;
    if (upper.years === lower.years) {
      rate = lower.rate;
    } else {
      rate = lower.rate + (upper.rate - lower.rate) * 
        (years - lower.years) / (upper.years - lower.years);
    }
    
    // Create tenor string
    let tenor;
    if (years < 1) {
      tenor = `${Math.round(years * 12)}M`;
    } else if (years === Math.floor(years)) {
      tenor = `${years}Y`;
    } else {
      tenor = `${years.toFixed(2)}Y`;
    }
    
    interpolatedPoints.push({
      tenor,
      years,
      rate
    });
  }
  
  return interpolatedPoints;
}

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const curveId = searchParams.get('id');
  const interpolate = searchParams.get('interpolate') === 'true';
  const resolution = parseInt(searchParams.get('resolution') || '100');
  const calculateForwards = searchParams.get('forwards') === 'true';
  
  try {
    // Get all curves or a specific curve
    let curves;
    if (curveId) {
      const index = parseInt(curveId);
      if (isNaN(index) || index < 0 || index >= sampleCurveData.length) {
        return NextResponse.json({ error: 'Invalid curve ID' }, { status: 400 });
      }
      curves = [sampleCurveData[index]];
    } else {
      curves = sampleCurveData;
    }
    
    // Process curves according to parameters
    const processedCurves = curves.map(curve => {
      let processedCurve = { ...curve };
      
      // Interpolate points if requested
      if (interpolate) {
        processedCurve.points = interpolateCurve(curve.points, curve.curveMethod, resolution);
      }
      
      // Calculate forward rates if requested
      if (calculateForwards && curve.curveType === 'zero') {
        const forwardCurve = {
          ...curve,
          curveType: 'forward' as const,
          name: `${curve.name} (Forward)`,
          points: calculateForwardRates(processedCurve.points)
        };
        return [processedCurve, forwardCurve];
      }
      
      return [processedCurve];
    });
    
    // Flatten array of arrays and return
    return NextResponse.json(processedCurves.flat());
  } catch (error) {
    console.error('Error in yield curve API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}