
import { CandleData, PairInfo } from './mockData';

// Identify key support and resistance levels based on previous day candles
export const identifyKeyLevels = (candles: CandleData[]): { support: number; resistance: number } => {
  if (candles.length < 2) {
    return { support: 0, resistance: 0 };
  }
  
  const previousDayCandle = candles[candles.length - 2];
  
  return {
    support: previousDayCandle.low,
    resistance: previousDayCandle.high,
  };
};

// Calculate position size based on risk percentage
export const calculatePositionSize = (
  accountBalance: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  pipValue: number = 0.1 // Default pip value, depends on the pair
): number => {
  const riskAmount = (accountBalance * riskPercentage) / 100;
  const priceDifference = Math.abs(entryPrice - stopLossPrice);
  const pipsDifference = priceDifference / pipValue;
  
  // Calculate position size based on risk and pip difference
  return riskAmount / pipsDifference;
};

// Calculate stop loss and take profit levels
export const calculateLevels = (
  entryPrice: number,
  tradeType: 'BUY' | 'SELL',
  previousDayWick: number,
  pipValue: number = 0.1,
  pipBuffer: number = 10, // Buffer in pips
  riskMultiplier1: number = 1.5, // Take profit 1 risk multiplier
  riskMultiplier2: number = 2 // Take profit 2 risk multiplier
): { stopLoss: number; takeProfit1: number; takeProfit2: number } => {
  const pipBufferInPrice = pipBuffer * pipValue;
  
  let stopLoss: number;
  
  if (tradeType === 'BUY') {
    // For buy trades, stop loss is below the entry
    stopLoss = Math.min(previousDayWick, entryPrice) - pipBufferInPrice;
    const risk = entryPrice - stopLoss;
    
    return {
      stopLoss,
      takeProfit1: entryPrice + (risk * riskMultiplier1),
      takeProfit2: entryPrice + (risk * riskMultiplier2),
    };
  } else {
    // For sell trades, stop loss is above the entry
    stopLoss = Math.max(previousDayWick, entryPrice) + pipBufferInPrice;
    const risk = stopLoss - entryPrice;
    
    return {
      stopLoss,
      takeProfit1: entryPrice - (risk * riskMultiplier1),
      takeProfit2: entryPrice - (risk * riskMultiplier2),
    };
  }
};

// Check if it's a valid trade based on indicators
export const isValidTrade = (
  tradeType: 'BUY' | 'SELL',
  currentPrice: number,
  sma50: number,
  rsi14: number
): boolean => {
  // Don't trade if RSI is in extreme conditions
  if (rsi14 > 70 && tradeType === 'BUY') return false;
  if (rsi14 < 30 && tradeType === 'SELL') return false;
  
  // Check if price is above SMA for buys and below for sells
  if (tradeType === 'BUY' && currentPrice < sma50) return false;
  if (tradeType === 'SELL' && currentPrice > sma50) return false;
  
  return true;
};

// Check if a candle has closed above/below a key level
export const hasClosedBeyondLevel = (
  candle: CandleData,
  level: number,
  direction: 'ABOVE' | 'BELOW'
): boolean => {
  return direction === 'ABOVE' 
    ? candle.close > level 
    : candle.close < level;
};

// Format price with appropriate decimal places
export const formatPrice = (price: number, symbol: string): string => {
  if (symbol === 'XAUUSD') {
    return price.toFixed(2);
  }
  return price.toFixed(3);
};

// Calculate pip value based on currency pair
export const getPipValue = (symbol: string): number => {
  switch(symbol) {
    case 'XAUUSD':
      return 0.01; // Gold is usually $0.01 per pip
    default:
      return 0.001; // Most forex pairs use 0.001 as a pip
  }
};

// Calculate profit/loss for a trade
export const calculateProfitLoss = (
  tradeType: 'BUY' | 'SELL',
  entryPrice: number,
  currentPrice: number,
  positionSize: number,
  pipValue: number
): number => {
  const priceDifference = tradeType === 'BUY' 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  const pipsDifference = priceDifference / pipValue;
  return pipsDifference * positionSize;
};

// Get a readable name for a trading pair
export const getPairName = (symbol: string): string => {
  switch(symbol) {
    case 'GBPJPY':
      return 'GBP/JPY';
    case 'USDJPY':
      return 'USD/JPY';
    case 'XAUUSD':
      return 'XAU/USD (Gold)';
    default:
      return symbol;
  }
};

// Function to get current active session
export const getCurrentSession = (): string => {
  const now = new Date();
  const hour = now.getUTCHours();
  const dayOfWeek = now.getUTCDay();
  
  // Check if it's a weekday (1-5 is Monday-Friday)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    if (hour >= 8 && hour < 16) {
      return 'London';
    } else if (hour >= 13 && hour < 21) {
      return 'New York';
    } else if ((hour >= 0 && hour < 8) || hour >= 21) {
      return 'Asian/Pacific';
    }
  }
  
  return 'Closed';
};

// Function to format account balance
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
