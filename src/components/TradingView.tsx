
import React, { useState, useEffect, useRef } from 'react';
import { CandleData, IndicatorValue } from '@/utils/mockData';
import { formatPrice } from '@/utils/tradingHelpers';

interface TradingViewProps {
  symbol: string;
  candles: CandleData[];
  indicators: {
    sma50: IndicatorValue[];
    ema9: IndicatorValue[];
    ema21: IndicatorValue[];
  };
  supportLevel?: number;
  resistanceLevel?: number;
}

const TradingView: React.FC<TradingViewProps> = ({
  symbol,
  candles,
  indicators,
  supportLevel,
  resistanceLevel,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  
  // Calculate chart dimensions based on container size
  useEffect(() => {
    if (chartRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setChartDimensions({ width, height });
        }
      });
      
      resizeObserver.observe(chartRef.current);
      return () => {
        if (chartRef.current) {
          resizeObserver.unobserve(chartRef.current);
        }
      };
    }
  }, []);

  // Get min and max prices from candles for scaling
  const priceRange = React.useMemo(() => {
    if (!candles.length) return { min: 0, max: 100 };
    
    let min = Math.min(...candles.map(c => c.low));
    let max = Math.max(...candles.map(c => c.high));
    
    // Add some padding
    const padding = (max - min) * 0.1;
    min -= padding;
    max += padding;
    
    return { min, max };
  }, [candles]);
  
  // Transform price to y coordinate
  const priceToY = (price: number) => {
    const { min, max } = priceRange;
    const ratio = (price - min) / (max - min);
    return chartDimensions.height - (ratio * chartDimensions.height);
  };
  
  // Handle chart hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || !candles.length) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate price from y coordinate
    const price = priceRange.min + (priceRange.max - priceRange.min) * 
      (1 - (y / chartDimensions.height));
    
    // Calculate date from x coordinate
    const candleIndex = Math.floor((x / chartDimensions.width) * candles.length);
    const date = candles[Math.min(candleIndex, candles.length - 1)]?.date || '';
    
    setHoverPrice(price);
    setHoverDate(date);
  };
  
  const handleMouseLeave = () => {
    setHoverPrice(null);
    setHoverDate(null);
  };
  
  if (!candles.length) {
    return (
      <div className="glass-panel w-full h-[500px] flex items-center justify-center">
        <p className="text-neutral-500">Loading chart data...</p>
      </div>
    );
  }
  
  const candleWidth = Math.max(chartDimensions.width / candles.length - 2, 1);
  
  return (
    <div className="relative glass-panel p-4 w-full h-[500px] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{symbol} Daily Chart</h3>
        {hoverPrice && hoverDate && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-600">{hoverDate}</span>
            <span className="text-sm font-medium">{formatPrice(hoverPrice, symbol)}</span>
          </div>
        )}
      </div>
      
      <div 
        ref={chartRef} 
        className="w-full h-[440px] relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Price axis */}
        <div className="absolute top-0 right-0 h-full w-12 flex flex-col justify-between py-2 text-xs text-neutral-500">
          <span>{formatPrice(priceRange.max, symbol)}</span>
          <span>{formatPrice((priceRange.max + priceRange.min) / 2, symbol)}</span>
          <span>{formatPrice(priceRange.min, symbol)}</span>
        </div>
        
        {/* Support level */}
        {supportLevel && (
          <div 
            className="absolute left-0 right-12 border-t border-dashed border-loss/70 z-10"
            style={{ top: `${priceToY(supportLevel)}px` }}
          >
            <span className="absolute -top-5 right-4 text-xs px-1 py-0.5 bg-loss/20 text-loss rounded">
              Support: {formatPrice(supportLevel, symbol)}
            </span>
          </div>
        )}
        
        {/* Resistance level */}
        {resistanceLevel && (
          <div 
            className="absolute left-0 right-12 border-t border-dashed border-profit/70 z-10"
            style={{ top: `${priceToY(resistanceLevel)}px` }}
          >
            <span className="absolute -top-5 right-4 text-xs px-1 py-0.5 bg-profit/20 text-profit rounded">
              Resistance: {formatPrice(resistanceLevel, symbol)}
            </span>
          </div>
        )}
        
        {/* Candles */}
        <svg className="absolute top-0 left-0 w-[calc(100%-12px)] h-full">
          {/* Grid lines */}
          <line
            x1="0"
            y1={priceToY((priceRange.max + priceRange.min) / 2)}
            x2="100%"
            y2={priceToY((priceRange.max + priceRange.min) / 2)}
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
          
          {/* SMA 50 */}
          <path
            d={indicators.sma50.map((point, i) => {
              if (isNaN(point.value)) return '';
              return `${i === 0 ? 'M' : 'L'} ${(i / candles.length) * chartDimensions.width} ${priceToY(point.value)}`;
            }).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          
          {/* EMA 9 */}
          <path
            d={indicators.ema9.map((point, i) => {
              if (isNaN(point.value)) return '';
              return `${i === 0 ? 'M' : 'L'} ${(i / candles.length) * chartDimensions.width} ${priceToY(point.value)}`;
            }).join(' ')}
            fill="none"
            stroke="#EC4899"
            strokeWidth="1.5"
          />
          
          {/* EMA 21 */}
          <path
            d={indicators.ema21.map((point, i) => {
              if (isNaN(point.value)) return '';
              return `${i === 0 ? 'M' : 'L'} ${(i / candles.length) * chartDimensions.width} ${priceToY(point.value)}`;
            }).join(' ')}
            fill="none"
            stroke="#FB923C"
            strokeWidth="1.5"
          />
          
          {/* Candles */}
          {candles.map((candle, i) => {
            const x = (i / candles.length) * chartDimensions.width;
            const isUp = candle.close >= candle.open;
            const candleColor = isUp ? '#34D399' : '#EF4444';
            
            return (
              <g key={i} className="candle">
                {/* Wick */}
                <line
                  x1={x + candleWidth / 2}
                  y1={priceToY(candle.high)}
                  x2={x + candleWidth / 2}
                  y2={priceToY(candle.low)}
                  stroke="#64748B"
                  strokeWidth="1"
                />
                
                {/* Body */}
                <rect
                  x={x}
                  y={priceToY(Math.max(candle.open, candle.close))}
                  width={candleWidth}
                  height={Math.max(1, Math.abs(priceToY(candle.open) - priceToY(candle.close)))}
                  fill={candleColor}
                />
              </g>
            );
          })}
        </svg>
        
        {/* Hover crosshair */}
        {hoverPrice && (
          <>
            <div className="absolute left-0 top-0 w-full border-t border-dashed border-neutral-400/30" style={{ top: `${priceToY(hoverPrice)}px` }}></div>
          </>
        )}
      </div>
      
      <div className="flex mt-2 space-x-4 text-xs">
        <div className="flex items-center">
          <span className="inline-block w-3 h-1 bg-[#3B82F6] mr-1"></span>
          <span>SMA 50</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-1 bg-[#EC4899] mr-1"></span>
          <span>EMA 9</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-1 bg-[#FB923C] mr-1"></span>
          <span>EMA 21</span>
        </div>
      </div>
    </div>
  );
};

export default TradingView;
