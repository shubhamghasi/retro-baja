import React from 'react';
import styles from './PlayerControls.module.css';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Moon,
  ListMusic,
} from 'lucide-react';
import { RepeatMode } from '../../types/player';
import { formatTime } from '../../utils/formatTime';
import { playTactileClick } from '../../utils/sfx';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onCycleRepeat: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isCinemaLights: boolean;
  onToggleCinemaLights: () => void;
  playlistCount: number;
  onOpenPlaylist: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onCycleRepeat,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  isCinemaLights,
  onToggleCinemaLights,
  playlistCount,
  onOpenPlaylist,
}) => {
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.controlsContainer}>
      {/* Progress & Scrubber Bar */}
      <div className={styles.progressRow}>
        <span className={styles.timeText}>{formatTime(currentTime)}</span>
        <div className={styles.scrubberWrapper}>
          <div className={styles.scrubberTrack}>
            <div
              className={styles.scrubberProgress}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            className={styles.scrubberInput}
            aria-label="Seek track position"
          />
        </div>
        <span className={styles.timeText}>{formatTime(duration)}</span>
      </div>

      {/* Control Buttons */}
      <div className={styles.buttonsRow}>
        {/* Left Side: Playlist Drawer & Volume */}
        <div className={styles.leftControls}>
          <button
            onClick={() => {
              playTactileClick();
              onOpenPlaylist();
            }}
            className={styles.playlistTriggerBtn}
            title="Open Playlist Drawer"
          >
            <ListMusic size={16} />
            <span>Playlist</span>
            <span className={styles.playlistBadge}>{playlistCount}</span>
          </button>

          <div className={styles.volumeWrapper}>
            <button
              onClick={() => {
                playTactileClick();
                onToggleMute();
              }}
              className={styles.ctrlBtn}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className={styles.volumeSlider}
              aria-label="Volume slider"
            />
          </div>
        </div>

        {/* Center: Shuffle, Prev, Play/Pause, Next, Repeat */}
        <div className={styles.centerControls}>
          <button
            onClick={() => {
              playTactileClick();
              onToggleShuffle();
            }}
            className={`${styles.ctrlBtn} ${isShuffle ? styles.ctrlBtnActive : ''}`}
            title={`Shuffle: ${isShuffle ? 'ON' : 'OFF'}`}
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onPrev();
            }}
            className={styles.ctrlBtn}
            title="Previous Track (P)"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onTogglePlay();
            }}
            className={styles.playPauseBtn}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause size={24} fill="#160d02" /> : <Play size={24} fill="#160d02" style={{ marginLeft: '3px' }} />}
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onNext();
            }}
            className={styles.ctrlBtn}
            title="Next Track (N)"
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onCycleRepeat();
            }}
            className={`${styles.ctrlBtn} ${repeatMode !== 'off' ? styles.ctrlBtnActive : ''}`}
            title={`Repeat: ${repeatMode.toUpperCase()}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Right Side: Lights Off & Fullscreen */}
        <div className={styles.rightControls}>
          <button
            onClick={() => {
              playTactileClick();
              onToggleCinemaLights();
            }}
            className={`${styles.ctrlBtn} ${isCinemaLights ? styles.ctrlBtnActive : ''}`}
            title="Cinema Mode (Lights Off - L)"
          >
            <Moon size={16} />
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onToggleFullscreen();
            }}
            className={`${styles.ctrlBtn} ${isFullscreen ? styles.ctrlBtnActive : ''}`}
            title="Toggle TV Fullscreen (F)"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
