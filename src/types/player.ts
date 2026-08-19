export type RepeatMode = 'off' | 'all' | 'one';

export type TvTheme = 'teakwood' | 'charcoal' | 'retromint';

export interface PlayerState {
  isReady: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 100
  quality: string;
  error: string | null;
}

export interface AmbientSettings {
  enabled: boolean;
  masterVolume: number; // 0 to 100
  rain: number; // 0 to 100
  vinyl: number; // 0 to 100
  fan: number; // 0 to 100
  crtHum: number; // 0 to 100
}
