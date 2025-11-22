export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
}

export enum AppMode {
  EDITOR = 'EDITOR',
  ZEN = 'ZEN' // For clean screenshots
}

export interface ClockStyle {
  faceColor: string;
  markerColor: string;
  hourHandColor: string;
  minuteHandColor: string;
  secondHandColor: string;
  hasSecondHand: boolean;
}