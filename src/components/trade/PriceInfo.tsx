
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice, formatCurrency } from '@/utils/tradingHelpers';

interface PriceInfoProps {
  currentPrice: number;
  accountBalance: number;
  symbol: string;
}

const PriceInfo: React.FC<PriceInfoProps> = ({
  currentPrice,
  accountBalance,
  symbol,
}) => {
  return (
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
  );
};

export default PriceInfo;
