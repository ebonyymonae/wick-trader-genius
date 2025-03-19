
import React from 'react';
import { TradeRecord } from '@/utils/mockData';
import { formatPrice, formatCurrency } from '@/utils/tradingHelpers';

interface TradeHistoryProps {
  trades: TradeRecord[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const calculateWinRate = () => {
    if (!trades.length) return 0;
    
    const closedTrades = trades.filter(trade => trade.status === 'CLOSED');
    if (!closedTrades.length) return 0;
    
    const winningTrades = closedTrades.filter(trade => trade.profit > 0);
    return (winningTrades.length / closedTrades.length) * 100;
  };
  
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const winRate = calculateWinRate();
  
  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Trade History</h3>
        <div className="flex space-x-3">
          <div className="flex flex-col items-end">
            <span className="text-xs text-neutral-500">Total P/L</span>
            <span className={`text-sm font-medium ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {formatCurrency(totalProfit)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-neutral-500">Win Rate</span>
            <span className="text-sm font-medium">{winRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <th className="py-2 text-left font-medium">Pair</th>
              <th className="py-2 text-left font-medium">Type</th>
              <th className="py-2 text-right font-medium">Entry</th>
              <th className="py-2 text-right font-medium">Exit</th>
              <th className="py-2 text-right font-medium">Risk</th>
              <th className="py-2 text-right font-medium">P/L</th>
              <th className="py-2 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {trades.length > 0 ? (
              trades.map((trade) => (
                <tr key={trade.id} className="group hover:bg-secondary/40 transition-colors">
                  <td className="py-3">{trade.symbol}</td>
                  <td className={`py-3 ${trade.type === 'BUY' ? 'text-profit' : 'text-loss'}`}>
                    {trade.type}
                  </td>
                  <td className="py-3 text-right">{formatPrice(trade.entryPrice, trade.symbol)}</td>
                  <td className="py-3 text-right">
                    {trade.closePrice ? formatPrice(trade.closePrice, trade.symbol) : '-'}
                  </td>
                  <td className="py-3 text-right">{formatCurrency(trade.riskAmount)}</td>
                  <td className={`py-3 text-right font-medium ${trade.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatCurrency(trade.profit)}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      trade.status === 'OPEN' 
                        ? 'bg-primary/20 text-primary' 
                        : trade.status === 'CLOSED' 
                          ? 'bg-neutral/20 text-neutral-700' 
                          : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500">
                  No trade history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
