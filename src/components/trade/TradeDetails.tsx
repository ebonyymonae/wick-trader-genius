
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatCurrency } from '@/utils/tradingHelpers';

interface TradeDetailsProps {
  symbol: string;
  tradeType: 'BUY' | 'SELL' | null;
  stopLoss: number;
  positionSize: number;
  takeProfit1: number;
  takeProfit2: number;
  potentialProfit1: number;
  potentialProfit2: number;
  isTradeValid: boolean;
  handlePlaceTrade: () => void;
}

const TradeDetails: React.FC<TradeDetailsProps> = ({
  symbol,
  tradeType,
  stopLoss,
  positionSize,
  takeProfit1,
  takeProfit2,
  potentialProfit1,
  potentialProfit2,
  isTradeValid,
  handlePlaceTrade,
}) => {
  if (!tradeType) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stopLoss">Stop Loss (50 pips)</Label>
          <Input 
            id="stopLoss" 
            value={formatPrice(stopLoss, symbol)} 
            readOnly 
            className="bg-secondary/50 text-loss"
          />
        </div>
        
        <div>
          <Label htmlFor="positionSize">Position Size</Label>
          <Input 
            id="positionSize" 
            value={positionSize.toFixed(2)} 
            readOnly 
            className="bg-secondary/50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="takeProfit1">Take Profit 1 (1.5R)</Label>
          <Input 
            id="takeProfit1" 
            value={formatPrice(takeProfit1, symbol)} 
            readOnly 
            className="bg-secondary/50 text-profit"
          />
          <p className="mt-1 text-xs text-profit">
            Potential profit: {formatCurrency(potentialProfit1)}
          </p>
        </div>
        
        <div>
          <Label htmlFor="takeProfit2">Take Profit 2 (2R)</Label>
          <Input 
            id="takeProfit2" 
            value={formatPrice(takeProfit2, symbol)} 
            readOnly 
            className="bg-secondary/50 text-profit"
          />
          <p className="mt-1 text-xs text-profit">
            Potential profit: {formatCurrency(potentialProfit2)}
          </p>
        </div>
      </div>
      
      <div className="pt-2">
        {!isTradeValid ? (
          <div className="text-sm text-loss bg-loss/10 p-3 rounded">
            This trade doesn't meet the strategy criteria. Check indicators and price levels.
          </div>
        ) : (
          <button 
            onClick={handlePlaceTrade}
            className={`w-full trade-button ${tradeType === 'BUY' ? 'buy-button' : 'sell-button'}`}
          >
            Place {tradeType} Order
          </button>
        )}
      </div>
    </div>
  );
};

export default TradeDetails;
