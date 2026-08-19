import React from 'react';
import styles from './PlaylistPanel.module.css';
import { Track, Channel } from '../../types/playlist';
import { PlaylistTrackItem } from './PlaylistTrackItem';
import { X, Search, ListMusic, Heart, History, Radio } from 'lucide-react';
import { playTactileClick } from '../../utils/sfx';

interface PlaylistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  tracks: Track[];
  currentTrackId: string;
  isPlaying: boolean;
  onSelectTrack: (trackId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: 'playlist' | 'favorites' | 'history';
  onTabChange: (tab: 'playlist' | 'favorites' | 'history') => void;
  isFavorite: (trackId: string) => boolean;
  onToggleFavorite: (trackId: string) => void;
  favoritesCount: number;
  historyCount: number;
}

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
  isOpen,
  onClose,
  channels,
  activeChannelId,
  onSelectChannel,
  tracks,
  currentTrackId,
  isPlaying,
  onSelectTrack,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  isFavorite,
  onToggleFavorite,
  favoritesCount,
  historyCount,
}) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitle}>
            <ListMusic size={22} color="var(--amber-led)" />
            <span>Cassette Vault</span>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className={styles.closeBtn}
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Tabs: Playlist / Favorites / History */}
        <div className={styles.tabsRow}>
          <button
            onClick={() => {
              playTactileClick();
              onTabChange('playlist');
            }}
            className={`${styles.tabBtn} ${activeTab === 'playlist' ? styles.tabBtnActive : ''}`}
          >
            All Tracks ({tracks.length})
          </button>
          <button
            onClick={() => {
              playTactileClick();
              onTabChange('favorites');
            }}
            className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.tabBtnActive : ''}`}
          >
            Favorites ({favoritesCount})
          </button>
          <button
            onClick={() => {
              playTactileClick();
              onTabChange('history');
            }}
            className={`${styles.tabBtn} ${activeTab === 'history' ? styles.tabBtnActive : ''}`}
          >
            History ({historyCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search song, artist, movie, era..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={styles.clearSearchBtn}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Channel Categories Horizontal Filter (only on Playlist tab) */}
        {activeTab === 'playlist' && (
          <div className={styles.channelsScroll}>
            {channels.map((ch) => {
              const isActive = activeChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChannel(ch.id)}
                  className={`${styles.channelPill} ${isActive ? styles.channelPillActive : ''}`}
                >
                  <Radio size={12} />
                  <span>{ch.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Track List */}
        <div className={styles.trackList}>
          {tracks.length === 0 ? (
            <div className={styles.emptyState}>
              {activeTab === 'favorites' ? (
                <>
                  <Heart size={32} color="var(--text-muted)" />
                  <p>No favorite tracks saved yet. Heart any track to save it here!</p>
                </>
              ) : activeTab === 'history' ? (
                <>
                  <History size={32} color="var(--text-muted)" />
                  <p>No recently played tracks in your listening history.</p>
                </>
              ) : (
                <>
                  <Search size={32} color="var(--text-muted)" />
                  <p>No tracks matching &quot;{searchQuery}&quot;</p>
                </>
              )}
            </div>
          ) : (
            tracks.map((track, idx) => (
              <PlaylistTrackItem
                key={track.id}
                track={track}
                index={idx}
                isActive={track.id === currentTrackId}
                isPlaying={isPlaying}
                isFavorite={isFavorite(track.id)}
                onSelect={() => onSelectTrack(track.id)}
                onToggleFavorite={() => onToggleFavorite(track.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
