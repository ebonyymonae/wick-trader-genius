
// Mock data for our trading application

export interface CandleData {
  date: string;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

export interface PairInfo {
  symbol: string;
  name: string;
  current: number;
  change: number;
  changePercent: number;
}

// Trading pairs
export const tradingPairs: PairInfo[] = [
  {
    symbol: 'GBPJPY',
    name: 'GBP/JPY',
    current: 192.653,
    change: 0.423,
    changePercent: 0.22,
  },
  {
    symbol: 'USDJPY',
    name: 'USD/JPY',
    current: 149.835,
    change: -0.215,
    changePercent: -0.14,
  },
  {
    symbol: 'XAUUSD',
    name: 'XAU/USD',
    current: 2325.67,
    change: 12.85,
    changePercent: 0.55,
  },
];

// Generate mock candle data for the past 30 days
export const generateMockCandles = (symbol: string, days = 30): CandleData[] => {
  const candles: CandleData[] = [];
  const now = new Date();
  
  // Base values that will be different for each symbol
  let basePrice = 0;
  let volatility = 0;
  
  switch(symbol) {
    case 'GBPJPY':
      basePrice = 190;
      volatility = 0.8;
      break;
    case 'USDJPY':
      basePrice = 150;
      volatility = 0.5;
      break;
    case 'XAUUSD':
      basePrice = 2300;
      volatility = 25;
      break;
    default:
      basePrice = 100;
      volatility = 1;
  }
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate somewhat realistic candle data with trends
    const trend = Math.sin(i / 5) * volatility; // Create some waves in the price
    const dayVolatility = volatility * (0.5 + Math.random());
    
    const open = basePrice + trend + (Math.random() - 0.5) * dayVolatility;
    const close = open + (Math.random() - 0.5) * dayVolatility;
    const high = Math.max(open, close) + Math.random() * dayVolatility * 0.5;
    const low = Math.min(open, close) - Math.random() * dayVolatility * 0.5;
    const volume = Math.floor(10000 + Math.random() * 50000);
    
    candles.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      close,
      low,
      volume
    });
    
    // Update the base price for the next day
    basePrice = close;
  }
  
  return candles;
};

// Account data
export const accountInfo = {
  balance: 10000,
  equity: 10245.32,
  openPositions: 2,
  profitLoss: 245.32,
};

// Mock trade history
export interface TradeRecord {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  closePrice: number | null;
  volume: number;
  openTime: string;
  closeTime: string | null;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  status: 'OPEN' | 'CLOSED' | 'PARTIALLY_CLOSED';
  profit: number;
  riskAmount: number;
}

export const tradeHistory: TradeRecord[] = [
  {
    id: 'T1001',
    symbol: 'GBPJPY',
    type: 'BUY',
    entryPrice: 191.853,
    closePrice: 192.653,
    volume: 0.1,
    openTime: '2023-06-10T09:30:00Z',
    closeTime: '2023-06-10T14:15:00Z',
    stopLoss: 191.553,
    takeProfit1: 192.303,
    takeProfit2: 192.753,
    status: 'CLOSED',
    profit: 80,
    riskAmount: 30,
  },
  {
    id: 'T1002',
    symbol: 'USDJPY',
    type: 'SELL',
    entryPrice: 150.235,
    closePrice: 149.835,
    volume: 0.15,
    openTime: '2023-06-11T08:45:00Z',
    closeTime: '2023-06-11T16:30:00Z',
    stopLoss: 150.535,
    takeProfit1: 149.935,
    takeProfit2: 149.635,
    status: 'CLOSED',
    profit: 60,
    riskAmount: 45,
  },
  {
    id: 'T1003',
    symbol: 'XAUUSD',
    type: 'BUY',
    entryPrice: 2315.45,
    closePrice: null,
    volume: 0.05,
    openTime: '2023-06-12T10:15:00Z',
    closeTime: null,
    stopLoss: 2305.45,
    takeProfit1: 2330.45,
    takeProfit2: 2345.45,
    status: 'OPEN',
    profit: 51.1,
    riskAmount: 50,
  },
];

// Technical indicators
export interface IndicatorValue {
  date: string;
  value: number;
}

// Generate mock indicator data based on candle data
export const generateIndicators = (candles: CandleData[]) => {
  // Simple function to calculate SMA
  const calculateSMA = (data: number[], period: number): number[] => {
    const sma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(NaN); // Not enough data yet
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    return sma;
  };
  
  // Simple function to calculate EMA
  const calculateEMA = (data: number[], period: number): number[] => {
    const ema: number[] = [];
    const k = 2 / (period + 1);
    
    // First EMA is SMA
    let previousEMA = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ema.push(NaN);
      } else if (i === period - 1) {
        ema.push(previousEMA);
      } else {
        previousEMA = data[i] * k + previousEMA * (1 - k);
        ema.push(previousEMA);
      }
    }
    
    return ema;
  };
  
  // Simple function to calculate RSI
  const calculateRSI = (data: number[], period: number): number[] => {
    const rsi: number[] = [];
    const changes: number[] = [];
    
    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i] - data[i - 1]);
    }
    
    // Prepare gain and loss arrays
    const gains: number[] = changes.map(change => change > 0 ? change : 0);
    const losses: number[] = changes.map(change => change < 0 ? Math.abs(change) : 0);
    
    // Calculate average gain and loss
    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        rsi.push(NaN);
      } else {
        const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
        
        if (avgLoss === 0) {
          rsi.push(100);
        } else {
          const rs = avgGain / avgLoss;
          rsi.push(100 - (100 / (1 + rs)));
        }
      }
    }
    
    return rsi;
  };

  const closePrices = candles.map(candle => candle.close);
  const dates = candles.map(candle => candle.date);
  
  const sma50 = calculateSMA(closePrices, 50);
  const ema9 = calculateEMA(closePrices, 9);
  const ema21 = calculateEMA(closePrices, 21);
  const rsi14 = calculateRSI(closePrices, 14);
  
  return {
    sma50: dates.map((date, i) => ({ date, value: sma50[i] })),
    ema9: dates.map((date, i) => ({ date, value: ema9[i] })),
    ema21: dates.map((date, i) => ({ date, value: ema21[i] })),
    rsi14: dates.map((date, i) => ({ date, value: rsi14[i] })),
  };
};

// Trading sessions
export interface TradingSession {
  name: string;
  startHour: number; // UTC hour
  endHour: number; // UTC hour
  daysActive: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export const tradingSessions: TradingSession[] = [
  {
    name: 'London',
    startHour: 8, // 8:00 UTC
    endHour: 16, // 16:00 UTC
    daysActive: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    name: 'New York',
    startHour: 13, // 13:00 UTC
    endHour: 21, // 21:00 UTC
    daysActive: [1, 2, 3, 4, 5], // Monday to Friday
  },
];

// Check if a specific trading session is active
export const isSessionActive = (session: TradingSession): boolean => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const hourOfDay = now.getUTCHours();
  
  return (
    session.daysActive.includes(dayOfWeek) &&
    hourOfDay >= session.startHour &&
    hourOfDay < session.endHour
  );
};
