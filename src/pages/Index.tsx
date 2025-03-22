import React, { useState, useEffect } from 'react';
import TradingView from '@/components/TradingView';
import TradeCalculator from '@/components/TradeCalculator';
import TechnicalIndicators from '@/components/TechnicalIndicators';
import SessionTimer from '@/components/SessionTimer';
import TradeHistory from '@/components/TradeHistory';
import TradingControls from '@/components/TradingControls';
import { 
  generateMockCandles, 
  tradingPairs, 
  tradeHistory as initialTradeHistory,
  accountInfo,
  generateIndicators,
  TradeRecord,
} from '@/utils/mockData';
import { identifyKeyLevels } from '@/utils/tradingHelpers';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activePair, setActivePair] = useState('GBPJPY');
  const [candles, setCandles] = useState(generateMockCandles(activePair));
  const [indicators, setIndicators] = useState(generateIndicators(candles));
  const [keyLevels, setKeyLevels] = useState(identifyKeyLevels(candles));
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>(initialTradeHistory);
  
  const currentPrice = candles[candles.length - 1]?.close || 0;
  
  const latestSma50 = indicators.sma50[indicators.sma50.length - 1]?.value || 0;
  const latestEma9 = indicators.ema9[indicators.ema9.length - 1]?.value || 0;
  const latestEma21 = indicators.ema21[indicators.ema21.length - 1]?.value || 0;
  const latestRsi = indicators.rsi14[indicators.rsi14.length - 1]?.value || 50;
  
  useEffect(() => {
    const newCandles = generateMockCandles(activePair);
    const newIndicators = generateIndicators(newCandles);
    const newKeyLevels = identifyKeyLevels(newCandles);
    
    setCandles(newCandles);
    setIndicators(newIndicators);
    setKeyLevels(newKeyLevels);
    
    toast({
      title: 'Changed Trading Pair',
      description: `Now viewing ${activePair} chart data`,
    });
  }, [activePair, toast]);
  
  const handlePlaceTrade = (tradeDetails: any) => {
    const newTrade: TradeRecord = {
      id: `T${Math.floor(Math.random() * 10000)}`,
      symbol: tradeDetails.symbol,
      type: tradeDetails.type,
      entryPrice: tradeDetails.entryPrice,
      closePrice: null,
      volume: tradeDetails.positionSize,
      openTime: new Date().toISOString(),
      closeTime: null,
      stopLoss: tradeDetails.stopLoss,
      takeProfit1: tradeDetails.takeProfit1,
      takeProfit2: tradeDetails.takeProfit2,
      status: 'OPEN',
      profit: 0,
      riskAmount: tradeDetails.riskAmount,
    };
    
    setTradeHistory(prev => [newTrade, ...prev]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Wick Trader Genius</h1>
            <p className="text-muted-foreground mt-1">Advanced trading strategy automation</p>
          </div>
          
          <div className="mt-4 md:mt-0 glass-panel px-4 py-2 flex space-x-6">
            <div>
              <div className="text-xs text-neutral-500">Balance</div>
              <div className="font-medium">${accountInfo.balance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Equity</div>
              <div className="font-medium">${accountInfo.equity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Open Positions</div>
              <div className="font-medium">{accountInfo.openPositions}</div>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <TradingControls 
              tradingPairs={tradingPairs}
              activePair={activePair}
              onChangePair={setActivePair}
            />
            
            <SessionTimer />
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <TradingView 
                symbol={activePair}
                candles={candles}
                indicators={{
                  sma50: indicators.sma50,
                  ema9: indicators.ema9,
                  ema21: indicators.ema21,
                }}
                supportLevel={keyLevels.support}
                resistanceLevel={keyLevels.resistance}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <TechnicalIndicators 
                  sma50={latestSma50}
                  ema9={latestEma9}
                  ema21={latestEma21}
                  rsi={latestRsi}
                  currentPrice={currentPrice}
                />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <TradeCalculator 
                  symbol={activePair}
                  currentPrice={currentPrice}
                  supportLevel={keyLevels.support}
                  resistanceLevel={keyLevels.resistance}
                  accountBalance={accountInfo.balance}
                  sma50={latestSma50}
                  rsi={latestRsi}
                  lastCandle={candles[candles.length - 1]}
                  candles={candles}
                  onPlaceTrade={handlePlaceTrade}
                />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <TradeHistory trades={tradeHistory} />
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-neutral-500">
          <p>Wick Trader Genius © {new Date().getFullYear()} | Trade smarter with precision</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
