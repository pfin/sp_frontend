/**
 * QuantLib types for the application
 */

export interface YieldCurvePoint {
  tenor: string;
  years: number;
  rate: number;
}

export interface YieldCurveData {
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

export interface NelsonSiegelSvenssonParams {
  beta0: number; // Long-term level parameter
  beta1: number; // Short-term component
  beta2: number; // Medium-term component
  beta3: number; // Second hump/trough
  tau1: number; // First time constant
  tau2: number; // Second time constant
}

export interface SmithWilsonParams {
  alpha: number; // Convergence speed parameter
  ultimateForwardRate: number; // UFR - long-term forward rate
}

export interface InterpolationParams {
  method: 'cubic' | 'linear' | 'nss' | 'smithwilson';
  resolution: number;
  extrapolate: boolean;
}

export interface ZeroCouponBond {
  maturity: number; // in years
  price: number;
  yield: number;
}

export interface SwapRate {
  tenor: string;
  years: number;
  rate: number;
  discountFactor: number;
}

// QuantLib calculation settings
export interface CalculationSettings {
  dayCounter: 'Actual360' | 'Actual365' | 'ActualActual' | 'Thirty360';
  compounding: 'Simple' | 'Compounded' | 'Continuous';
  frequency: 'Annual' | 'Semiannual' | 'Quarterly' | 'Monthly' | 'Daily';
  businessDayConvention: 'Following' | 'ModifiedFollowing' | 'Preceding' | 'ModifiedPreceding';
  endOfMonth: boolean;
}

// Bootstrap inputs for creating a yield curve
export interface BootstrapInput {
  type: 'deposit' | 'fra' | 'future' | 'swap' | 'bond';
  tenor: string;
  rate: number;
  includeInCurve: boolean;
}

// Multi-curve framework types
export interface MultiCurveSetup {
  discountingCurve: YieldCurveData;
  forecastingCurves: {
    [index: string]: YieldCurveData;
  };
}

// Curve calibration result
export interface CalibrationResult {
  success: boolean;
  error?: string;
  iterations: number;
  parameters: NelsonSiegelSvenssonParams | SmithWilsonParams;
  rmse: number; // Root mean square error
  originalPoints: YieldCurvePoint[];
  fittedPoints: YieldCurvePoint[];
}

// Yield curve calculation result
export interface YieldCurveResult {
  curve: YieldCurveData;
  forwardCurve?: YieldCurveData;
  discountFactors?: {
    [maturity: string]: number;
  };
  zeroCouponRates?: {
    [maturity: string]: number;
  };
  parRates?: {
    [maturity: string]: number;
  };
}