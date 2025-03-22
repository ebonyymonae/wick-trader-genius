
import React, { useState, useEffect } from 'react';
import { CandleData } from '@/utils/mockData';
import { 
  calculatePositionSize, 
  calculateWickBox,
  shouldExecuteTrade,
  shouldTradeInCurrentSession,
  getCurrentSession,
  formatPrice,
  getPipValue
} from '@/utils/tradingHelpers';
import { useToast } from '@/components/ui/use-toast';
import PriceInfo from './trade/PriceInfo';
import RiskSettings from './trade/RiskSettings';
import TradeDirectionSelector from './trade/TradeDirectionSelector';
import TradeDetails from './trade/TradeDetails';
import WickBoxInfo from './trade/WickBoxInfo';

interface TradeCalculatorProps {
  symbol: string;
  currentPrice: number;
  supportLevel: number;
  resistanceLevel: number;
  accountBalance: number;
  sma50: number;
  rsi: number;
  lastCandle?: CandleData;
  candles: CandleData[];
  onPlaceTrade: (tradeDetails: any) => void;
}

const TradeCalculator: React.FC<TradeCalculatorProps> = ({
  symbol,
  currentPrice,
  accountBalance,
  sma50,
  rsi,
  candles,
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
  const [wickBox, setWickBox] = useState({ top: 0, bottom: 0, halfway: 0 });
  
  const pipValue = getPipValue(symbol);
  const currentSession = getCurrentSession();
  
  // Calculate the wick box when candles change
  useEffect(() => {
    if (candles.length < 2) return;
    
    const calculatedWickBox = calculateWickBox(candles);
    setWickBox(calculatedWickBox);
    
    // Check if we should execute a trade based on the wick box strategy
    const { shouldTrade, tradeType: recommendedTradeType } = shouldExecuteTrade(
      currentPrice,
      calculatedWickBox
    );
    
    // Check if the pair should be traded in current session
    const validSession = shouldTradeInCurrentSession(symbol, currentSession);
    
    if (shouldTrade && recommendedTradeType && validSession) {
      setTradeType(recommendedTradeType);
    } else {
      setTradeType(null);
      setIsTradeValid(false);
    }
  }, [candles, currentPrice, symbol, currentSession]);
  
  // Calculate trade details when type changes
  useEffect(() => {
    if (!tradeType) {
      setIsTradeValid(false);
      return;
    }
    
    // Set trade as valid since we've already checked conditions when setting the tradeType
    setIsTradeValid(true);
    
    // Calculate risk amount
    const risk = (accountBalance * riskPercentage) / 100;
    setRiskAmount(risk);
    
    // Calculate position size based on 50 pip stop loss
    const fixedStopLossPips = 50;
    const stopLossBuffer = fixedStopLossPips * pipValue;
    
    // Set stop loss at 50 pips away from entry
    const newStopLoss = tradeType === 'BUY' 
      ? currentPrice - stopLossBuffer 
      : currentPrice + stopLossBuffer;
    
    setStopLoss(newStopLoss);
    
    // Calculate take profit levels based on risk:reward ratios
    const riskDistance = Math.abs(currentPrice - newStopLoss);
    const tp1Distance = riskDistance * 1.5;
    const tp2Distance = riskDistance * 2;
    
    const newTakeProfit1 = tradeType === 'BUY'
      ? currentPrice + tp1Distance
      : currentPrice - tp1Distance;
      
    const newTakeProfit2 = tradeType === 'BUY'
      ? currentPrice + tp2Distance
      : currentPrice - tp2Distance;
    
    setTakeProfit1(newTakeProfit1);
    setTakeProfit2(newTakeProfit2);
    
    // Calculate position size
    const posSize = calculatePositionSize(
      accountBalance,
      riskPercentage,
      currentPrice,
      newStopLoss,
      pipValue
    );
    
    setPositionSize(posSize);
    
    // Calculate potential profits
    const profit1 = Math.abs(newTakeProfit1 - currentPrice) / pipValue * posSize;
    const profit2 = Math.abs(newTakeProfit2 - currentPrice) / pipValue * posSize;
    
    setPotentialProfit1(profit1);
    setPotentialProfit2(profit2);
  }, [tradeType, currentPrice, accountBalance, pipValue, riskPercentage]);
  
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
      
      <PriceInfo 
        currentPrice={currentPrice}
        accountBalance={accountBalance}
        symbol={symbol}
      />
      
      <WickBoxInfo wickBox={wickBox} symbol={symbol} />
      
      <RiskSettings
        riskPercentage={riskPercentage}
        riskAmount={riskAmount}
        setRiskPercentage={setRiskPercentage}
      />
      
      <TradeDirectionSelector
        tradeType={tradeType}
        setTradeType={setTradeType}
      />
      
      {tradeType && (
        <TradeDetails
          symbol={symbol}
          tradeType={tradeType}
          stopLoss={stopLoss}
          positionSize={positionSize}
          takeProfit1={takeProfit1}
          takeProfit2={takeProfit2}
          potentialProfit1={potentialProfit1}
          potentialProfit2={potentialProfit2}
          isTradeValid={isTradeValid}
          handlePlaceTrade={handlePlaceTrade}
        />
      )}
    </div>
  );
};

export default TradeCalculator;
