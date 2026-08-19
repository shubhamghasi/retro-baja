import { useState, useMemo, useCallback } from 'react';
import playlistData from '../data/playlist.json';
import { Track, Channel } from '../types/playlist';
import { RepeatMode } from '../types/player';
import { shuffleArray } from '../utils/shuffle';
import { useLocalStorage } from './useLocalStorage';
import { playKnobClick, playChannelStaticBurst } from '../utils/sfx';

export function usePlaylist() {
  const channels = playlistData.channels as Channel[];
  const allTracks = playlistData.tracks as Track[];

  const [activeChannelId, setActiveChannelId] = useLocalStorage<string>('retrobaja_channel', 'all');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useLocalStorage<boolean>('retrobaja_shuffle', false);
  const [repeatMode, setRepeatMode] = useLocalStorage<RepeatMode>('retrobaja_repeat', 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useLocalStorage<string[]>('retrobaja_favorites', []);
  const [history, setHistory] = useLocalStorage<string[]>('retrobaja_history', []);
  const [activeTab, setActiveTab] = useState<'playlist' | 'favorites' | 'history'>('playlist');

  // Filtered tracks based on active channel and search
  const displayedTracks = useMemo(() => {
    let list = allTracks;

    if (activeTab === 'favorites') {
      list = allTracks.filter((t) => favorites.includes(t.id));
    } else if (activeTab === 'history') {
      // Map history ids in order
      list = history
        .map((id) => allTracks.find((t) => t.id === id))
        .filter((t): t is Track => !!t);
    } else {
      if (activeChannelId && activeChannelId !== 'all') {
        list = list.filter((t) => t.channelId === activeChannelId);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.movieOrAlbum.toLowerCase().includes(q) ||
          t.era.toLowerCase().includes(q) ||
          t.mood.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allTracks, activeChannelId, searchQuery, favorites, history, activeTab]);

  // Current track resolution
  const currentTrack: Track = useMemo(() => {
    if (displayedTracks.length === 0) {
      return allTracks[0];
    }
    const safeIndex = Math.max(0, Math.min(currentTrackIndex, displayedTracks.length - 1));
    return displayedTracks[safeIndex] || allTracks[0];
  }, [displayedTracks, currentTrackIndex, allTracks]);

  const activeChannel: Channel = useMemo(() => {
    return channels.find((c) => c.id === activeChannelId) || channels[0];
  }, [channels, activeChannelId]);

  // Record track to history
  const recordHistory = useCallback(
    (trackId: string) => {
      setHistory((prev) => {
        const filtered = prev.filter((id) => id !== trackId);
        return [trackId, ...filtered].slice(0, 30); // Keep last 30
      });
    },
    [setHistory]
  );

  // Select track by ID
  const selectTrackById = useCallback(
    (trackId: string) => {
      const index = displayedTracks.findIndex((t) => t.id === trackId);
      if (index !== -1) {
        setCurrentTrackIndex(index);
        recordHistory(trackId);
      } else {
        const anyIndex = allTracks.findIndex((t) => t.id === trackId);
        if (anyIndex !== -1) {
          // If track exists in another channel, switch to 'all' or that channel
          const trk = allTracks[anyIndex];
          setActiveChannelId(trk.channelId);
          setCurrentTrackIndex(0);
          recordHistory(trackId);
        }
      }
    },
    [displayedTracks, allTracks, recordHistory, setActiveChannelId]
  );

  // Switch channel
  const setChannel = useCallback(
    (channelId: string) => {
      playChannelStaticBurst();
      playKnobClick();
      setActiveChannelId(channelId);
      setCurrentTrackIndex(0);
    },
    [setActiveChannelId]
  );

  // Cycle to next channel (knob turning)
  const cycleNextChannel = useCallback(() => {
    const currentIndex = channels.findIndex((c) => c.id === activeChannelId);
    const nextIndex = (currentIndex + 1) % channels.length;
    setChannel(channels[nextIndex].id);
  }, [channels, activeChannelId, setChannel]);

  // Cycle to prev channel
  const cyclePrevChannel = useCallback(() => {
    const currentIndex = channels.findIndex((c) => c.id === activeChannelId);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    setChannel(channels[prevIndex].id);
  }, [channels, activeChannelId, setChannel]);

  // Next Track
  const nextTrack = useCallback(() => {
    if (displayedTracks.length === 0) return;

    if (repeatMode === 'one') {
      // Repeat current track
      return;
    }

    if (isShuffle) {
      const remainingIndices = displayedTracks
        .map((_, i) => i)
        .filter((i) => i !== currentTrackIndex);
      if (remainingIndices.length > 0) {
        const randomIdx = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
        setCurrentTrackIndex(randomIdx);
        recordHistory(displayedTracks[randomIdx].id);
        return;
      }
    }

    const nextIndex = (currentTrackIndex + 1) % displayedTracks.length;
    setCurrentTrackIndex(nextIndex);
    recordHistory(displayedTracks[nextIndex].id);
  }, [displayedTracks, repeatMode, isShuffle, currentTrackIndex, recordHistory]);

  // Prev Track
  const prevTrack = useCallback(() => {
    if (displayedTracks.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + displayedTracks.length) % displayedTracks.length;
    setCurrentTrackIndex(prevIndex);
    recordHistory(displayedTracks[prevIndex].id);
  }, [displayedTracks, currentTrackIndex, recordHistory]);

  // Toggle Favorite
  const toggleFavorite = useCallback(
    (trackId: string) => {
      setFavorites((prev) => {
        if (prev.includes(trackId)) {
          return prev.filter((id) => id !== trackId);
        } else {
          return [...prev, trackId];
        }
      });
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (trackId: string) => {
      return favorites.includes(trackId);
    },
    [favorites]
  );

  // Surprise Me
  const surpriseMe = useCallback(() => {
    playChannelStaticBurst();
    const shuffled = shuffleArray(allTracks);
    const randomTrack = shuffled[0];
    if (randomTrack) {
      selectTrackById(randomTrack.id);
    }
  }, [allTracks, selectTrackById]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, [setIsShuffle]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, [setRepeatMode]);

  return {
    channels,
    allTracks,
    displayedTracks,
    currentTrack,
    currentTrackIndex,
    activeChannel,
    activeChannelId,
    isShuffle,
    repeatMode,
    searchQuery,
    favorites,
    history,
    activeTab,
    setSearchQuery,
    setActiveTab,
    setChannel,
    cycleNextChannel,
    cyclePrevChannel,
    selectTrackById,
    nextTrack,
    prevTrack,
    toggleFavorite,
    isFavorite,
    surpriseMe,
    toggleShuffle,
    cycleRepeat,
  };
}
