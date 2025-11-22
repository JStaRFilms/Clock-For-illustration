import React, { useMemo } from 'react';
import { TimeState, ClockStyle } from '../types';

interface ClockProps {
  time: TimeState;
  style: ClockStyle;
  size?: number;
}

export const Clock: React.FC<ClockProps> = ({ time, style, size = 500 }) => {
  const { hours, minutes, seconds } = time;

  // Calculate angles
  const secondDegrees = seconds * 6;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;

  // Generate Markers
  const markers = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const isHour = i % 5 === 0;
      const angle = i * 6;
      const length = isHour ? 15 : 5; // Percentage of radius
      const width = isHour ? 3 : 1;
      
      return (
        <line
          key={i}
          x1="50"
          y1="10"
          x2="50"
          y2={10 + length}
          transform={`rotate(${angle} 50 50)`}
          stroke={style.markerColor}
          strokeWidth={width}
          strokeLinecap="round"
        />
      );
    });
  }, [style.markerColor]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
      >
        {/* Clock Face Background */}
        <circle cx="50" cy="50" r="48" fill={style.faceColor} stroke={style.markerColor} strokeWidth="1" />
        
        {/* Markers */}
        {markers}

        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke={style.hourHandColor}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hourDegrees} 50 50)`}
          className="transition-transform duration-75 ease-out"
        />

        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke={style.minuteHandColor}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minuteDegrees} 50 50)`}
          className="transition-transform duration-75 ease-out"
        />

        {/* Second Hand */}
        {style.hasSecondHand && (
          <g transform={`rotate(${secondDegrees} 50 50)`} className="transition-transform duration-75 ease-linear">
             <line
              x1="50"
              y1="60"
              x2="50"
              y2="10"
              stroke={style.secondHandColor}
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="2" fill={style.secondHandColor} />
          </g>
        )}
        
        {/* Center Cap */}
        <circle cx="50" cy="50" r="1.5" fill={style.markerColor} />
      </svg>
    </div>
  );
};