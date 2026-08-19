import React from 'react';
import styles from './NowPlaying.module.css';
import { Track, Channel } from '../../types/playlist';
import { Heart, Disc3 } from 'lucide-react';
import { playTactileClick } from '../../utils/sfx';

interface NowPlayingProps {
  currentTrack: Track;
  activeChannel: Channel;
  isPlaying: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  currentTrack,
  activeChannel,
  isPlaying,
  isFavorite,
  onToggleFavorite,
}) => {
  const handleFavClick = () => {
    playTactileClick();
    onToggleFavorite();
  };

  return (
    <div className={styles.nowPlayingCard}>
      {/* Track Metadata */}
      <div className={styles.trackInfoSection}>
        <div className={styles.metaBadges}>
          <span className={`${styles.badge} ${styles.channelBadge}`}>
            {activeChannel.channelNumber} • {activeChannel.name}
          </span>
          <span className={`${styles.badge} ${styles.eraBadge}`}>
            {currentTrack.era}
          </span>
          <span className={`${styles.badge} ${styles.moodBadge}`}>
            {currentTrack.mood}
          </span>
          <span className={styles.badge}>
            {currentTrack.year}
          </span>
        </div>

        <h3 className={styles.songTitle} title={currentTrack.title}>
          {currentTrack.title}
        </h3>

        <div className={styles.artistRow}>
          <span>{currentTrack.artist}</span>
          <span>•</span>
          <span className={styles.movieAlbum}>
            <Disc3 size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {currentTrack.movieOrAlbum}
          </span>
        </div>
      </div>

      {/* Right Equalizer & Favorite Toggle */}
      <div className={styles.rightActions}>
        {/* Retro Equalizer Animation */}
        <div className={styles.equalizer} title={isPlaying ? 'Playing' : 'Paused'}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`${styles.eqBar} ${isPlaying ? styles.eqBarPlaying : ''}`}
            />
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavClick}
          className={`${styles.favButton} ${isFavorite ? styles.favButtonActive : ''}`}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>
    </div>
  );
};
