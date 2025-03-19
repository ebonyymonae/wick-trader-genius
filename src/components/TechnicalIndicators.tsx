
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface TechnicalIndicatorsProps {
  sma50: number;
  ema9: number;
  ema21: number;
  rsi: number;
  currentPrice: number;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  sma50,
  ema9,
  ema21,
  rsi,
  currentPrice,
}) => {
  // Determine trend based on indicator values
  const trend = React.useMemo(() => {
    if (currentPrice > sma50 && ema9 > ema21) {
      return 'uptrend';
    } else if (currentPrice < sma50 && ema9 < ema21) {
      return 'downtrend';
    } else {
      return 'neutral';
    }
  }, [currentPrice, sma50, ema9, ema21]);
  
  // Determine RSI condition
  const rsiCondition = React.useMemo(() => {
    if (rsi > 70) return 'overbought';
    if (rsi < 30) return 'oversold';
    return 'neutral';
  }, [rsi]);

  return (
    <div className="glass-panel p-6 space-y-5">
      <h3 className="text-lg font-medium">Technical Indicators</h3>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm">SMA 50</span>
          <span className="text-sm font-medium">{sma50.toFixed(3)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-secondary rounded-full h-1">
            <div 
              className="h-full rounded-full bg-primary transition-all" 
              style={{ width: `${Math.min(100, currentPrice > sma50 ? 75 : 25)}%` }}
            ></div>
          </div>
          <span className={`text-xs ml-2 ${currentPrice > sma50 ? 'text-profit' : 'text-loss'}`}>
            {currentPrice > sma50 ? 'Above' : 'Below'}
          </span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm">EMA 9</span>
          <span className="text-sm font-medium">{ema9.toFixed(3)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-secondary rounded-full h-1">
            <div 
              className="h-full rounded-full bg-[#EC4899] transition-all" 
              style={{ width: `${Math.min(100, ema9 > ema21 ? 75 : 25)}%` }}
            ></div>
          </div>
          <span className={`text-xs ml-2 ${ema9 > ema21 ? 'text-profit' : 'text-loss'}`}>
            {ema9 > ema21 ? 'Above EMA 21' : 'Below EMA 21'}
          </span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm">EMA 21</span>
          <span className="text-sm font-medium">{ema21.toFixed(3)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-secondary rounded-full h-1">
            <div 
              className="h-full rounded-full bg-[#FB923C] transition-all" 
              style={{ width: `${Math.min(100, ema21 > sma50 ? 75 : 25)}%` }}
            ></div>
          </div>
          <span className={`text-xs ml-2 ${ema21 > sma50 ? 'text-profit' : 'text-loss'}`}>
            {ema21 > sma50 ? 'Above SMA 50' : 'Below SMA 50'}
          </span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm">RSI (14)</span>
          <span 
            className={`text-sm font-medium ${
              rsi > 70 ? 'text-loss' : rsi < 30 ? 'text-profit' : 'text-foreground'
            }`}
          >
            {rsi.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className={`h-full rounded-full transition-all ${
              rsi > 70 ? 'bg-loss' : rsi < 30 ? 'bg-profit' : 'bg-primary'
            }`} 
            style={{ width: `${rsi}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-neutral-500">
          <span>Oversold</span>
          <span>Neutral</span>
          <span>Overbought</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="text-sm">Current Trend:</div>
        <div className={`indicator-pill ${
          trend === 'uptrend' 
            ? 'bg-profit/20 text-profit' 
            : trend === 'downtrend' 
              ? 'bg-loss/20 text-loss' 
              : 'bg-neutral/20 text-neutral-700'
        }`}>
          {trend === 'uptrend' 
            ? 'Bullish' 
            : trend === 'downtrend' 
              ? 'Bearish' 
              : 'Neutral'}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm">RSI Condition:</div>
        <div className={`indicator-pill ${
          rsiCondition === 'overbought' 
            ? 'bg-loss/20 text-loss' 
            : rsiCondition === 'oversold' 
              ? 'bg-profit/20 text-profit' 
              : 'bg-neutral/20 text-neutral-700'
        }`}>
          {rsiCondition === 'overbought' 
            ? 'Overbought' 
            : rsiCondition === 'oversold' 
              ? 'Oversold' 
              : 'Neutral'}
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;
