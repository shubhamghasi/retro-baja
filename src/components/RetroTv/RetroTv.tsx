import React from 'react';
import styles from './RetroTv.module.css';
import { TvAntenna } from './TvAntenna';
import { TvDials } from './TvDials';
import { TvScreenOverlay } from './TvScreenOverlay';
import { Track, Channel } from '../../types/playlist';

interface RetroTvProps {
  containerId: string;
  isPowered: boolean;
  onTogglePower: () => void;
  onTurnOn: () => void;
  currentTrack: Track;
  activeChannel: Channel;
  channelIndex: number;
  totalChannels: number;
  onNextChannel: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isPlaying: boolean;
  isBuffering: boolean;
  error: string | null;
  isFullscreen: boolean;
  onSurpriseMe: () => void;
}

export const RetroTv: React.FC<RetroTvProps> = ({
  containerId,
  isPowered,
  onTogglePower,
  onTurnOn,
  currentTrack,
  activeChannel,
  channelIndex,
  totalChannels,
  onNextChannel,
  volume,
  onVolumeChange,
  isPlaying,
  isBuffering,
  error,
  isFullscreen,
  onSurpriseMe,
}) => {
  return (
    <div className={`${styles.tvContainer} ${isFullscreen ? styles.tvFullscreen : ''}`}>
      {/* Top Telescopic Antenna */}
      <TvAntenna />

      {/* Main Wooden Cabinet Chassis */}
      <div className={styles.tvCabinet}>
        {/* Left / Main CRT Screen Section */}
        <div className={styles.screenHousing}>
          <div className={styles.screenAspectBox}>
            {/* The Target Div where YouTube API injects the iframe */}
            <div className={styles.screenContent}>
              <div id={containerId} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Overlays (Standby Turn-On hero + CRT Bezel Sheen) */}
            <TvScreenOverlay
              isPowered={isPowered}
              onTurnOn={onTurnOn}
              currentTrack={currentTrack}
              isBuffering={isBuffering}
              error={error}
            />
          </div>
        </div>

        {/* Right / Physical Controls Panel */}
        <TvDials
          isPowered={isPowered}
          onTogglePower={onTogglePower}
          activeChannel={activeChannel}
          channelIndex={channelIndex}
          totalChannels={totalChannels}
          onNextChannel={onNextChannel}
          volume={volume}
          onVolumeChange={onVolumeChange}
          isPlaying={isPlaying}
          onSurpriseMe={onSurpriseMe}
        />
      </div>

      {/* TV Legs */}
      <div className={styles.tvLegsWrapper}>
        <div className={`${styles.tvLeg} ${styles.tvLegLeft}`} />
        <div className={`${styles.tvLeg} ${styles.tvLegRight}`} />
      </div>
    </div>
  );
};
