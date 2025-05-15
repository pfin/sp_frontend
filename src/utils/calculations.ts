/**
 * Calculation utilities for Currency Futures Arbitrage Platform
 */
import { ImpliedDifferentialResult } from '@/types';

/**
 * Calculates the implied interest rate differential between two futures contracts
 * using the formula: [(F2/F1)^(DC/days) - 1] × 100
 * 
 * @param nearPrice Price of the near-term futures contract (F1)
 * @param farPrice Price of the far-term futures contract (F2)
 * @param daysBetween Number of days between contracts
 * @param dayCountConvention Day count convention (365 or 360 depending on currency)
 * @returns The calculated implied interest rate differential in basis points
 */
export function calculateImpliedDifferential(
  nearPrice: number,
  farPrice: number,
  daysBetween: number,
  dayCountConvention: number
): ImpliedDifferentialResult {
  if (nearPrice <= 0 || farPrice <= 0) {
    throw new Error('Contract prices must be positive');
  }
  
  if (daysBetween <= 0) {
    throw new Error('Days between contracts must be positive');
  }
  
  if (dayCountConvention !== 360 && dayCountConvention !== 365) {
    throw new Error('Day count convention must be 360 or 365');
  }

  // Calculate the implied differential using the formula: [(F2/F1)^(DC/days) - 1] × 100
  const priceRatio = farPrice / nearPrice;
  const exponent = dayCountConvention / daysBetween;
  const implied = (Math.pow(priceRatio, exponent) - 1) * 100;
  
  // Return the result with associated context
  return {
    value: implied,
    formula: "[(F2/F1)^(DC/days) - 1] × 100",
    inputs: {
      nearPrice,
      farPrice,
      daysBetween,
      dayCountConvention,
    }
  };
}

/**
 * Calculates the actual interest rate differential between two benchmark rates
 *
 * @param baseRate Interest rate for the base currency
 * @param quoteRate Interest rate for the quote currency
 * @returns The actual interest rate differential in basis points
 */
export function calculateActualDifferential(
  baseRate: number,
  quoteRate: number
): number {
  return baseRate - quoteRate;
}

/**
 * Calculates the basis divergence between implied and actual differentials
 *
 * @param impliedDifferential Implied interest rate differential
 * @param actualDifferential Actual interest rate differential
 * @param fxBasis FX basis swap spread
 * @returns The basis divergence in basis points
 */
export function calculateBasisDivergence(
  impliedDifferential: number,
  actualDifferential: number,
  fxBasis: number
): number {
  return impliedDifferential - actualDifferential - fxBasis;
}

/**
 * Determines if an arbitrage opportunity exists based on the basis divergence
 *
 * @param basisDivergence The basis divergence in basis points
 * @param threshold The threshold in basis points (default: 5)
 * @returns Whether an arbitrage opportunity exists
 */
export function isArbitrageOpportunity(
  basisDivergence: number,
  threshold: number = 5
): boolean {
  return Math.abs(basisDivergence) >= threshold;
}

/**
 * Calculates the profit potential for an arbitrage opportunity
 *
 * @param basisDivergence The basis divergence in basis points
 * @param notional The notional amount in base currency
 * @param contractValue The value of one futures contract
 * @returns The potential profit
 */
export function calculateProfitPotential(
  basisDivergence: number,
  notional: number,
  contractValue: number
): number {
  // Convert basis points to decimal: 1 bp = 0.0001
  const decimalDivergence = Math.abs(basisDivergence) / 10000;
  
  // Calculate number of contracts needed
  const numContracts = Math.floor(notional / contractValue);
  
  // Calculate potential profit
  return numContracts * contractValue * decimalDivergence;
}