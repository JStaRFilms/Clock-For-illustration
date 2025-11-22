import { ClockStyle } from './types';

export const DEFAULT_TIME: { hours: number; minutes: number; seconds: number } = {
  hours: 10,
  minutes: 10,
  seconds: 30,
};

export const SWISS_STYLE: ClockStyle = {
  faceColor: '#ffffff',
  markerColor: '#1e293b',
  hourHandColor: '#1e293b',
  minuteHandColor: '#1e293b',
  secondHandColor: '#ef4444', // Red
  hasSecondHand: true,
};

export const DARK_STYLE: ClockStyle = {
  faceColor: '#1e293b',
  markerColor: '#cbd5e1',
  hourHandColor: '#e2e8f0',
  minuteHandColor: '#e2e8f0',
  secondHandColor: '#38bdf8', // Blue
  hasSecondHand: true,
};

// Model for AI time parsing
export const GEMINI_MODEL = 'gemini-2.5-flash';