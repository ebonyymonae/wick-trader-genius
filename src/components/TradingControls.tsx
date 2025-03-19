
import React from 'react';
import { PairInfo } from '@/utils/mockData';
import { Button } from '@/components/ui/button';

interface TradingControlsProps {
  tradingPairs: PairInfo[];
  activePair: string;
  onChangePair: (symbol: string) => void;
}

const TradingControls: React.FC<TradingControlsProps> = ({
  tradingPairs,
  activePair,
  onChangePair,
}) => {
  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Trading Pairs</h3>
        <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
          Wick Trader Strategy
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {tradingPairs.map((pair) => (
          <Button
            key={pair.symbol}
            variant="outline"
            onClick={() => onChangePair(pair.symbol)}
            className={`h-auto py-3 flex justify-between items-center transition-all border ${
              activePair === pair.symbol 
                ? 'bg-primary/10 border-primary/30' 
                : 'bg-transparent hover:bg-secondary'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{pair.name}</span>
              <span className="text-xs text-neutral-500">{pair.symbol}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="font-medium">{pair.current.toFixed(3)}</span>
              <span className={`text-xs ${pair.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(3)} ({pair.changePercent.toFixed(2)}%)
              </span>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <h4 className="text-sm font-medium mb-2">Strategy Requirements</h4>
        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Only trade when candle closes beyond previous day's wicks
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Focus on London and New York sessions for better liquidity
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Confirm trend with 50 SMA, 9 EMA, and 21 EMA
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Use RSI to avoid overbought/oversold conditions
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TradingControls;
