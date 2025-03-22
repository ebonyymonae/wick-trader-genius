
import React from 'react';
import { Button } from '@/components/ui/button';

interface TradeDirectionSelectorProps {
  tradeType: 'BUY' | 'SELL' | null;
  setTradeType: (type: 'BUY' | 'SELL') => void;
}

const TradeDirectionSelector: React.FC<TradeDirectionSelectorProps> = ({
  tradeType,
  setTradeType,
}) => {
  return (
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
  );
};

export default TradeDirectionSelector;
