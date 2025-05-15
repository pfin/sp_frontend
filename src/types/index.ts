/**
 * Type definitions for the Currency Futures Arbitrage Platform
 */

/**
 * Represents a currency pair and its associated contracts and rates
 */
export interface CurrencyPair {
  id: string;                   // e.g., "CADUSD"
  baseCurrency: string;         // e.g., "CAD"
  quoteCurrency: string;        // e.g., "USD"
  nearContractTicker: string;   // e.g., "CDM5 Curncy"
  farContractTicker: string;    // e.g., "CDU5 Curncy"
  dayCountConvention: number;   // e.g., 365 for CAD, GBP, AUD; 360 for USD, EUR, JPY, CHF
  basisTicker: string;          // e.g., "CDXOQQC BGN Curncy"
  benchmarkRateTicker: {
    base: string;               // e.g., "CAONREPO Index"
    quote: string;              // e.g., "SOFRRATE Index"
  };
  displayName: string;          // e.g., "CAD/USD"
  isActive: boolean;            // Whether this pair is active in the dashboard
}

/**
 * Represents market data for a currency pair at a specific timestamp
 */
export interface MarketData {
  id: string;                   // Unique identifier
  timestamp: Date;              // When the data was recorded
  pairId: string;               // Reference to the currency pair
  nearContractPrice: number;    // Price of the near-term contract
  farContractPrice: number;     // Price of the far-term contract
  daysBetween: number;          // Days between the two contracts
  baseRate: number;             // Interest rate for the base currency
  quoteRate: number;            // Interest rate for the quote currency
  fxBasis: number;              // FX basis swap spread
  impliedDifferential: number;  // Calculated implied interest rate differential
  actualDifferential: number;   // Actual interest rate differential
  basisDivergence: number;      // Difference between implied and actual differentials
}

/**
 * User preferences for the platform
 */
export interface UserPreferences {
  theme: 'light' | 'dark';
  favoritesCurrencyPairs: string[];  // Array of currency pair IDs
  alertThresholds: Record<string, number>; // Map of currency pair ID to basis points threshold
  dashboardLayout: DashboardWidget[];
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  id: string;
  type: 'summary' | 'chart' | 'heatmap' | 'details';
  config: Record<string, unknown>;  // Configuration specific to the widget type
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Alert for arbitrage opportunities
 */
export interface Alert {
  id: string;
  userId: string;
  pairId: string;
  threshold: number;  // In basis points
  triggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  acknowledgedAt?: Date;
}

/**
 * Calculation result for implied differential
 */
export interface ImpliedDifferentialResult {
  value: number;
  formula: string;
  inputs: {
    nearPrice: number;
    farPrice: number;
    daysBetween: number;
    dayCountConvention: number;
  };
}

/**
 * Custom error types
 */
export enum ErrorType {
  DATA_FETCH_ERROR = 'DATA_FETCH_ERROR',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  API_ERROR = 'API_ERROR',
}

/**
 * Application error
 */
export interface AppError {
  type: ErrorType;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * User information
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

/**
 * Time period for historical data
 */
export type TimePeriod = '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'custom';

/**
 * Historical data request parameters
 */
export interface HistoricalDataParams {
  pairId: string;
  period: TimePeriod;
  startDate?: Date;  // For custom period
  endDate?: Date;    // For custom period
}