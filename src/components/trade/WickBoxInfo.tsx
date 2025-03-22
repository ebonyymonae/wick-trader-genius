
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/utils/tradingHelpers';

interface WickBoxInfoProps {
  wickBox: {
    top: number;
    bottom: number;
    halfway: number;
  };
  symbol: string;
}

const WickBoxInfo: React.FC<WickBoxInfoProps> = ({ wickBox, symbol }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Wick Box Analysis</h4>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="wickTop">Top</Label>
          <Input 
            id="wickTop" 
            value={formatPrice(wickBox.top, symbol)} 
            readOnly 
            className="bg-secondary/50"
          />
        </div>
        
        <div>
          <Label htmlFor="wickHalfway" className="text-primary font-medium">Halfway</Label>
          <Input 
            id="wickHalfway" 
            value={formatPrice(wickBox.halfway, symbol)} 
            readOnly 
            className="bg-primary/10 border-primary/30"
          />
        </div>
        
        <div>
          <Label htmlFor="wickBottom">Bottom</Label>
          <Input 
            id="wickBottom" 
            value={formatPrice(wickBox.bottom, symbol)} 
            readOnly 
            className="bg-secondary/50"
          />
        </div>
      </div>
    </div>
  );
};

export default WickBoxInfo;
