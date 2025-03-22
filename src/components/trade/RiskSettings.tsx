
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/tradingHelpers';

interface RiskSettingsProps {
  riskPercentage: number;
  riskAmount: number;
  setRiskPercentage: (value: number) => void;
}

const RiskSettings: React.FC<RiskSettingsProps> = ({
  riskPercentage,
  riskAmount,
  setRiskPercentage,
}) => {
  return (
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
      <p className="mt-1 text-xs text-muted-foreground">Risk amount: {formatCurrency(riskAmount)}</p>
    </div>
  );
};

export default RiskSettings;
