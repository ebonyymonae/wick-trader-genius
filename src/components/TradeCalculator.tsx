
import React, { useState, useEffect } from 'react';
import { CandleData } from '@/utils/mockData';
import { 
  calculatePositionSize, 
  calculateLevels,
  isValidTrade,
  formatPrice,
  getPipValue,
  formatCurrency
} from '@/utils/tradingHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface TradeCalculatorProps {
  symbol: string;
  currentPrice: number;
  supportLevel: number;
  resistanceLevel: number;
  accountBalance: number;
  sma50: number;
  rsi: number;
  lastCandle?: CandleData;
  onPlaceTrade: (tradeDetails: any) => void;
}

const TradeCalculator: React.FC<TradeCalculatorProps> = ({
  symbol,
  currentPrice,
  supportLevel,
  resistanceLevel,
  accountBalance,
  sma50,
  rsi,
  lastCandle,
  onPlaceTrade,
}) => {
  const { toast } = useToast();
  const [riskPercentage, setRiskPercentage] = useState(1);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL' | null>(null);
  const [positionSize, setPositionSize] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit1, setTakeProfit1] = useState(0);
  const [takeProfit2, setTakeProfit2] = useState(0);
  const [riskAmount, setRiskAmount] = useState(0);
  const [potentialProfit1, setPotentialProfit1] = useState(0);
  const [potentialProfit2, setPotentialProfit2] = useState(0);
  const [isTradeValid, setIsTradeValid] = useState(false);
  
  const pipValue = getPipValue(symbol);
  
  // Check if we should recommend a trade type based on price vs levels
  useEffect(() => {
    if (!lastCandle) return;
    
    if (lastCandle.close > resistanceLevel) {
      setTradeType('BUY');
    } else if (lastCandle.close < supportLevel) {
      setTradeType('SELL');
    } else {
      setTradeType(null);
    }
  }, [lastCandle, supportLevel, resistanceLevel]);
  
  // Calculate trade details when type changes
  useEffect(() => {
    if (!tradeType) {
      setIsTradeValid(false);
      return;
    }
    
    // Validate the trade with technical indicators
    const valid = isValidTrade(tradeType, currentPrice, sma50, rsi);
    setIsTradeValid(valid);
    
    // Calculate risk amount
    const risk = (accountBalance * riskPercentage) / 100;
    setRiskAmount(risk);
    
    // Calculate position size and levels
    const pivotLevel = tradeType === 'BUY' ? resistanceLevel : supportLevel;
    const wickLevel = tradeType === 'BUY' ? supportLevel : resistanceLevel;
    
    const levels = calculateLevels(
      currentPrice,
      tradeType,
      wickLevel,
      pipValue,
      15, // 15 pips buffer
      1.5,
      2
    );
    
    setStopLoss(levels.stopLoss);
    setTakeProfit1(levels.takeProfit1);
    setTakeProfit2(levels.takeProfit2);
    
    // Calculate potential profits
    const posSize = calculatePositionSize(
      accountBalance,
      riskPercentage,
      currentPrice,
      levels.stopLoss,
      pipValue
    );
    
    setPositionSize(posSize);
    
    const profit1 = Math.abs(levels.takeProfit1 - currentPrice) / pipValue * posSize;
    const profit2 = Math.abs(levels.takeProfit2 - currentPrice) / pipValue * posSize;
    
    setPotentialProfit1(profit1);
    setPotentialProfit2(profit2);
  }, [tradeType, currentPrice, supportLevel, resistanceLevel, riskPercentage, accountBalance, pipValue, sma50, rsi]);
  
  const handlePlaceTrade = () => {
    if (!tradeType || !isTradeValid) return;
    
    const tradeDetails = {
      symbol,
      type: tradeType,
      entryPrice: currentPrice,
      stopLoss,
      takeProfit1,
      takeProfit2,
      positionSize,
      riskAmount,
      potentialProfit1,
      potentialProfit2,
      date: new Date().toISOString(),
    };
    
    onPlaceTrade(tradeDetails);
    
    toast({
      title: 'Trade Placed',
      description: `${tradeType} order placed for ${symbol} at ${formatPrice(currentPrice, symbol)}`,
    });
  };
  
  return (
    <div className="glass-panel p-6 space-y-6">
      <h3 className="text-lg font-medium">Trade Calculator</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentPrice">Current Price</Label>
          <Input 
            id="currentPrice" 
            value={formatPrice(currentPrice, symbol)} 
            readOnly 
            className="bg-secondary/50"
          />
        </div>
        
        <div>
          <Label htmlFor="accountBalance">Account Balance</Label>
          <Input 
            id="accountBalance" 
            value={formatCurrency(accountBalance)} 
            readOnly 
            className="bg-secondary/50"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="riskPercentage">Risk Percentage</Label>
        <div className="flex items-center mt-1">
          <Input 
            id="riskPercentage" 
            type="number" 
            min="0.1"
            max="5"
            step="0.1"
            value={riskPercentage} 
            onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 1)}
            className="focus-ring"
          />
          <span className="ml-2">%</span>
        </div>
        <p className="mt-1 text-xs text-neutral-500">Risk amount: {formatCurrency(riskAmount)}</p>
      </div>
      
      <div className="space-y-2">
        <p className="font-medium">Trade Direction</p>
        <div className="flex space-x-3">
          <Button
            variant={tradeType === 'BUY' ? "default" : "outline"}
            onClick={() => setTradeType('BUY')}
            className={`w-full ${tradeType === 'BUY' ? 'buy-button' : 'neutral-button'}`}
          >
            Buy
          </Button>
          <Button
            variant={tradeType === 'SELL' ? "default" : "outline"}
            onClick={() => setTradeType('SELL')}
            className={`w-full ${tradeType === 'SELL' ? 'sell-button' : 'neutral-button'}`}
          >
            Sell
          </Button>
        </div>
      </div>
      
      {tradeType && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stopLoss">Stop Loss</Label>
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
              <Button 
                onClick={handlePlaceTrade}
                className={`w-full ${tradeType === 'BUY' ? 'buy-button' : 'sell-button'}`}
              >
                Place {tradeType} Order
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeCalculator;
