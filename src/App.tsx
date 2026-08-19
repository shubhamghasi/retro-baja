import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header/Header';
import { RetroTv } from './components/RetroTv/RetroTv';
import { NowPlaying } from './components/NowPlaying/NowPlaying';
import { PlayerControls } from './components/PlayerControls/PlayerControls';
import { PlaylistPanel } from './components/PlaylistPanel/PlaylistPanel';
import { ShortcutsModal } from './components/ShortcutsModal/ShortcutsModal';

import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { usePlaylist } from './hooks/usePlaylist';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TvTheme } from './types/player';
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
    console.warn('YouTube Player Error:', errorMsg);
  }, []);

  const {
    playerState,
    play,
    pause,
    togglePlay,
    loadVideo,
    seekTo,
    setVolume,
    toggleMute,
  } = useYouTubePlayer({
    containerId: 'yt-player-target',
    initialVideoId: currentTrack.youtubeVideoId,
    onTrackEnded: handleTrackEnded,
    onErrorTrack: handleTrackError,
  });

  // Track video switching
  const prevTrackIdRef = useRef<string>(currentTrack.id);
  useEffect(() => {
    if (prevTrackIdRef.current !== currentTrack.id) {
      prevTrackIdRef.current = currentTrack.id;
      if (isPowered) {
        loadVideo(currentTrack.youtubeVideoId, true);
      }
    }
  }, [currentTrack.id, currentTrack.youtubeVideoId, isPowered, loadVideo]);

  // Turn ON TV logic
  const handleTurnOn = useCallback(() => {
    playTvPowerOnSfx();
    setIsPowered(true);
    setTimeout(() => {
      loadVideo(currentTrack.youtubeVideoId, true);
      play();
    }, 400);
  }, [currentTrack.youtubeVideoId, loadVideo, play, setIsPowered]);

  // Power switch toggle
  const handleTogglePower = useCallback(() => {
    if (isPowered) {
      pause();
      setIsPowered(false);
    } else {
      handleTurnOn();
    }
  }, [isPowered, pause, handleTurnOn, setIsPowered]);

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
    onNext: nextTrack,
    onPrev: prevTrack,
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
          currentTrack={currentTrack}
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
          currentTrack={currentTrack}
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
          onNext={nextTrack}
          onPrev={prevTrack}
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
