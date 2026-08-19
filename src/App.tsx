import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header/Header';
import { RetroTv } from './components/RetroTv/RetroTv';
import { NowPlaying } from './components/NowPlaying/NowPlaying';
import { PlayerControls } from './components/PlayerControls/PlayerControls';
import { PlaylistPanel } from './components/PlaylistPanel/PlaylistPanel';
import { ShortcutsModal } from './components/ShortcutsModal/ShortcutsModal';

import { useYouTubePlayer, VideoData } from './hooks/useYouTubePlayer';
import { usePlaylist } from './hooks/usePlaylist';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TvTheme } from './types/player';
import { Track } from './types/playlist';
import { playTvPowerOnSfx } from './utils/sfx';

export const App: React.FC = () => {
  // Application State
  const [isPowered, setIsPowered] = useLocalStorage<boolean>('retrobaja_power', false);
  const [currentTheme, setCurrentTheme] = useLocalStorage<TvTheme>('retrobaja_theme', 'teakwood');
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isAmbientOpen, setIsAmbientOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isFullscreenTv, setIsFullscreenTv] = useState<boolean>(false);
  const [isCinemaLights, setIsCinemaLights] = useState<boolean>(false);

  // Playlist state & hooks
  const {
    channels,
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
    selectTrackById,
    nextTrack,
    prevTrack,
    toggleFavorite,
    isFavorite,
    surpriseMe,
    toggleShuffle,
    cycleRepeat,
  } = usePlaylist();

  // Dynamic live track info synced with YouTube player
  const [liveTrackInfo, setLiveTrackInfo] = useState<Partial<Track> | null>(null);

  // Ambient Audio hook
  const {
    settings: ambientSettings,
    toggleEnabled: toggleAmbient,
    updateVolume: updateAmbientVolume,
  } = useAmbientAudio();

  // YouTube Player setup
  const handleTrackEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  const handleTrackError = useCallback((errorMsg: string) => {
    console.warn('YouTube Player Error (Auto-recovering):', errorMsg);
  }, []);

  const handleVideoDataChange = useCallback((data: VideoData) => {
    if (data && data.title) {
      setLiveTrackInfo((prev) => {
        if (prev?.title === data.title) return prev;
        return {
          title: data.title,
          artist: data.author || 'Retro Classics',
        };
      });
    }
  }, []);

  const {
    playerState,
    play,
    pause,
    togglePlay,
    loadVideo,
    loadPlaylist,
    nextVideo,
    previousVideo,
    seekTo,
    setVolume,
    toggleMute,
  } = useYouTubePlayer({
    containerId: 'yt-player-target',
    initialPlaylistId: activeChannel.playlistId || 'PLVFLMYM1tErk',
    initialVideoId: currentTrack.youtubeVideoId,
    onTrackEnded: handleTrackEnded,
    onErrorTrack: handleTrackError,
    onVideoDataChange: handleVideoDataChange,
  });

  // Track video switching
  const prevTrackIdRef = useRef<string>(currentTrack.id);
  useEffect(() => {
    if (prevTrackIdRef.current !== currentTrack.id) {
      prevTrackIdRef.current = currentTrack.id;
      setLiveTrackInfo(null);
      if (isPowered) {
        loadVideo(currentTrack.youtubeVideoId, true);
      }
    }
  }, [currentTrack.id, currentTrack.youtubeVideoId, isPowered, loadVideo]);

  // Channel playlist switching
  const prevChannelIdRef = useRef<string>(activeChannel.id);
  useEffect(() => {
    if (prevChannelIdRef.current !== activeChannel.id) {
      prevChannelIdRef.current = activeChannel.id;
      setLiveTrackInfo(null);
      if (isPowered && activeChannel.playlistId) {
        loadPlaylist(activeChannel.playlistId, 0, true);
      }
    }
  }, [activeChannel.id, activeChannel.playlistId, isPowered, loadPlaylist]);

  // Turn ON TV logic
  const handleTurnOn = useCallback(() => {
    playTvPowerOnSfx();
    setIsPowered(true);
    setTimeout(() => {
      if (activeChannel.playlistId) {
        loadPlaylist(activeChannel.playlistId, 0, true);
      } else {
        loadVideo(currentTrack.youtubeVideoId, true);
      }
      play();
    }, 400);
  }, [activeChannel.playlistId, currentTrack.youtubeVideoId, loadPlaylist, loadVideo, play, setIsPowered]);

  // Power switch toggle
  const handleTogglePower = useCallback(() => {
    if (isPowered) {
      pause();
      setIsPowered(false);
    } else {
      handleTurnOn();
    }
  }, [isPowered, pause, handleTurnOn, setIsPowered]);

  // Combined Track Info (Static Curated Data + Live YouTube Video Data)
  const displayTrack: Track = {
    ...currentTrack,
    title: liveTrackInfo?.title || currentTrack.title,
    artist: liveTrackInfo?.artist || currentTrack.artist,
  };

  const handleNext = useCallback(() => {
    nextVideo();
    nextTrack();
  }, [nextVideo, nextTrack]);

  const handlePrev = useCallback(() => {
    previousVideo();
    prevTrack();
  }, [previousVideo, prevTrack]);

  // Theme change sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onTogglePlay: () => {
      if (!isPowered) {
        handleTurnOn();
      } else {
        togglePlay();
      }
    },
    onNext: handleNext,
    onPrev: handlePrev,
    onToggleMute: toggleMute,
    onToggleShuffle: toggleShuffle,
    onCycleChannel: cycleNextChannel,
    onToggleFullscreen: () => setIsFullscreenTv((prev) => !prev),
    onToggleLights: () => setIsCinemaLights((prev) => !prev),
    onToggleAmbient: toggleAmbient,
    onToggleHelp: () => setIsShortcutsOpen((prev) => !prev),
    onEscape: () => {
      setIsPlaylistOpen(false);
      setIsAmbientOpen(false);
      setIsShortcutsOpen(false);
      setIsFullscreenTv(false);
    },
  });

  return (
    <div
      className={`app-root ${isCinemaLights ? 'cinema-lights-off' : ''}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Ambient background atmosphere layers */}
      <div className="retro-room-bg" />
      <div className="retro-room-vignette" />

      {/* Top Header Navigation */}
      <Header
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        ambientSettings={ambientSettings}
        onToggleAmbient={toggleAmbient}
        onUpdateAmbientVolume={updateAmbientVolume}
        isAmbientOpen={isAmbientOpen}
        onToggleAmbientOpen={() => setIsAmbientOpen((prev) => !prev)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Center Content Section */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 16px 40px 16px',
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}
      >
        {/* Retro Vintage CRT Television */}
        <RetroTv
          containerId="yt-player-target"
          isPowered={isPowered}
          onTogglePower={handleTogglePower}
          onTurnOn={handleTurnOn}
          currentTrack={displayTrack}
          activeChannel={activeChannel}
          channelIndex={currentTrackIndex}
          totalChannels={channels.length}
          onNextChannel={cycleNextChannel}
          volume={playerState.volume}
          onVolumeChange={setVolume}
          isPlaying={playerState.isPlaying}
          isBuffering={playerState.isBuffering}
          error={playerState.error}
          isFullscreen={isFullscreenTv}
          onSurpriseMe={surpriseMe}
        />

        {/* Now Playing Song Details */}
        <NowPlaying
          currentTrack={displayTrack}
          activeChannel={activeChannel}
          isPlaying={playerState.isPlaying}
          isFavorite={isFavorite(currentTrack.id)}
          onToggleFavorite={() => toggleFavorite(currentTrack.id)}
        />

        {/* Playback Controls Bar */}
        <PlayerControls
          isPlaying={playerState.isPlaying}
          onTogglePlay={() => {
            if (!isPowered) handleTurnOn();
            else togglePlay();
          }}
          onNext={handleNext}
          onPrev={handlePrev}
          isShuffle={isShuffle}
          onToggleShuffle={toggleShuffle}
          repeatMode={repeatMode}
          onCycleRepeat={cycleRepeat}
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          onSeek={seekTo}
          volume={playerState.volume}
          onVolumeChange={setVolume}
          isMuted={playerState.isMuted}
          onToggleMute={toggleMute}
          isFullscreen={isFullscreenTv}
          onToggleFullscreen={() => setIsFullscreenTv((prev) => !prev)}
          isCinemaLights={isCinemaLights}
          onToggleCinemaLights={() => setIsCinemaLights((prev) => !prev)}
          playlistCount={displayedTracks.length}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
        />
      </main>

      {/* Slide-out Playlist Drawer */}
      <PlaylistPanel
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        channels={channels}
        activeChannelId={activeChannelId}
        onSelectChannel={setChannel}
        tracks={displayedTracks}
        currentTrackId={currentTrack.id}
        isPlaying={playerState.isPlaying}
        onSelectTrack={(trackId) => {
          selectTrackById(trackId);
          if (!isPowered) {
            handleTurnOn();
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        favoritesCount={favorites.length}
        historyCount={history.length}
      />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default App;
