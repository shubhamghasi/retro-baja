import React from 'react';
import styles from './PlaylistPanel.module.css';
import { Track } from '../../types/playlist';
import { Heart, Volume2 } from 'lucide-react';
import { playTactileClick } from '../../utils/sfx';

interface PlaylistTrackItemProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export const PlaylistTrackItem: React.FC<PlaylistTrackItemProps> = ({
  track,
  index,
  isActive,
  isPlaying,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const handleItemClick = () => {
    playTactileClick();
    onSelect();
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    onToggleFavorite();
  };

  const padNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

  return (
    <div
      onClick={handleItemClick}
      className={`${styles.trackItem} ${isActive ? styles.trackItemActive : ''}`}
    >
      <div className={styles.trackLeft}>
        <span className={`${styles.trackNumber} ${isActive ? styles.trackNumberActive : ''}`}>
          {isActive && isPlaying ? (
            <Volume2 size={16} color="var(--amber-led)" />
          ) : (
            padNum
          )}
        </span>

        <div className={styles.trackDetails}>
          <span className={styles.itemTitle} title={track.title}>
            {track.title}
          </span>
          <span className={styles.itemArtist} title={track.artist}>
            {track.artist} • {track.movieOrAlbum} ({track.year})
          </span>
        </div>
      </div>

      <div className={styles.trackRight}>
        {track.duration && <span className={styles.itemDuration}>{track.duration}</span>}
        <button
          onClick={handleFavClick}
          className={`${styles.itemFavBtn} ${isFavorite ? styles.itemFavActive : ''}`}
          title={isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
        >
          <Heart size={14} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>
    </div>
  );
};
