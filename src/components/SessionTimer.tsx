
import React, { useState, useEffect } from 'react';
import { tradingSessions, isSessionActive } from '@/utils/mockData';

const SessionTimer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSession, setActiveSession] = useState<string | null>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Determine active session
    const londonActive = isSessionActive(tradingSessions[0]);
    const newYorkActive = isSessionActive(tradingSessions[1]);
    
    if (londonActive && newYorkActive) {
      setActiveSession('London & New York');
    } else if (londonActive) {
      setActiveSession('London');
    } else if (newYorkActive) {
      setActiveSession('New York');
    } else {
      setActiveSession(null);
    }
  }, [currentTime]);
  
  // Format current time for display
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
  
  // Format current date for display
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate time until next session
  const getNextSessionInfo = () => {
    const now = currentTime;
    const currentDay = now.getUTCDay();
    const currentHour = now.getUTCHours();
    const currentMinutes = now.getUTCMinutes();
    
    // Only consider sessions on weekdays
    if (currentDay >= 1 && currentDay <= 5) {
      // London session (8-16 UTC)
      if (currentHour < 8) {
        const minutesUntil = (8 - currentHour - 1) * 60 + (60 - currentMinutes);
        return { session: 'London', minutesUntil };
      }
      
      // New York session (13-21 UTC)
      if (currentHour < 13) {
        const minutesUntil = (13 - currentHour - 1) * 60 + (60 - currentMinutes);
        return { session: 'New York', minutesUntil };
      }
      
      // Next day London session
      if (currentDay < 5) {
        const hoursUntil = 24 - currentHour + 8;
        const minutesUntil = (hoursUntil - 1) * 60 + (60 - currentMinutes);
        return { session: 'London (Tomorrow)', minutesUntil };
      }
    }
    
    // Weekend - next session is Monday London
    const daysUntil = currentDay === 6 ? 2 : 1; // Saturday: 2 days, Sunday: 1 day
    const hoursUntil = 24 - currentHour + (daysUntil - 1) * 24 + 8;
    const minutesUntil = (hoursUntil - 1) * 60 + (60 - currentMinutes);
    
    return { session: 'London (Monday)', minutesUntil };
  };
  
  const nextSession = getNextSessionInfo();
  
  // Format minutes until next session
  const formatTimeUntil = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };
  
  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-lg font-medium">Market Sessions</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">Current Time (Local):</div>
          <div className="text-sm font-medium">{formattedTime}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">Date:</div>
          <div className="text-sm">{formattedDate}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">Active Session:</div>
          {activeSession ? (
            <div className="indicator-pill bg-profit/20 text-profit animate-pulse-subtle">
              {activeSession}
            </div>
          ) : (
            <div className="indicator-pill bg-neutral/20 text-neutral-700">
              No Active Session
            </div>
          )}
        </div>
        
        {!activeSession && nextSession && (
          <div className="flex justify-between items-center">
            <div className="text-sm">Next Session:</div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{nextSession.session}</span>
              <span className="indicator-pill bg-secondary text-muted-foreground">
                in {formatTimeUntil(nextSession.minutesUntil)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-2 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isSessionActive(tradingSessions[0]) 
                ? 'bg-profit animate-pulse-subtle' 
                : 'bg-neutral'
            }`}></div>
            <span className="text-sm">London Session</span>
          </div>
          <span className="text-xs text-neutral-500">08:00 - 16:00 UTC</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isSessionActive(tradingSessions[1]) 
                ? 'bg-profit animate-pulse-subtle' 
                : 'bg-neutral'
            }`}></div>
            <span className="text-sm">New York Session</span>
          </div>
          <span className="text-xs text-neutral-500">13:00 - 21:00 UTC</span>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
