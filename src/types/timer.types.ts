export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerState {
    hours: number;
    minutes: number;
    seconds: number;
    isActive: boolean;
    mode: TimerMode;
}