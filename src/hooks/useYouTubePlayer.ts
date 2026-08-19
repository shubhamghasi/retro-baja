import { useEffect, useRef, useState, useCallback } from 'react';
import { PlayerState } from '../types/player';

// Declare YT global namespace for TypeScript
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          host?: string;
          videoId?: string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            disablekb?: 0 | 1;
            enablejsapi?: 0 | 1;
            fs?: 0 | 1;
            iv_load_policy?: 1 | 3;
            modestbranding?: 0 | 1;
            playsinline?: 0 | 1;
            rel?: 0 | 1;
            origin?: string;
            widget_referrer?: string;
          };
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number; target: YTPlayerInstance }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  loadVideoById: (options: { videoId: string; startSeconds?: number } | string) => void;
  cueVideoById: (options: { videoId: string; startSeconds?: number } | string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
}

interface UseYouTubePlayerProps {
  containerId: string;
  initialVideoId?: string;
  onTrackEnded?: () => void;
  onErrorTrack?: (errorMsg: string) => void;
}

export function useYouTubePlayer({
  containerId,
  initialVideoId,
  onTrackEnded,
  onErrorTrack,
}: UseYouTubePlayerProps) {
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isReady: false,
    isPlaying: false,
    isBuffering: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
    quality: 'hd720',
    error: null,
  });

  const onTrackEndedRef = useRef(onTrackEnded);
  onTrackEndedRef.current = onTrackEnded;

  const onErrorTrackRef = useRef(onErrorTrack);
  onErrorTrackRef.current = onErrorTrack;

  // Poll progress while playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (playerState.isPlaying && playerRef.current) {
      interval = setInterval(() => {
        try {
          if (playerRef.current) {
            const current = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || 0;
            const vol = playerRef.current.getVolume?.() ?? 80;
            const muted = playerRef.current.isMuted?.() ?? false;

            setPlayerState((prev) => ({
              ...prev,
              currentTime: current,
              duration: dur,
              volume: vol,
              isMuted: muted,
            }));
          }
        } catch {
          // Graceful fallback
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playerState.isPlaying]);

  // Initialize YouTube Iframe Player API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!isMounted || !window.YT || !window.YT.Player) return;

      const element = document.getElementById(containerId);
      if (!element) return;

      try {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {
            // Safe cleanup
          }
          playerRef.current = null;
        }

        playerRef.current = new window.YT.Player(containerId, {
          host: 'https://www.youtube.com',
          videoId: initialVideoId || '1xN5-3t_p-Q',
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
            fs: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
            widget_referrer: typeof window !== 'undefined' ? window.location.href : undefined,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              event.target.setVolume(80);
              setPlayerState((prev) => ({
                ...prev,
                isReady: true,
                duration: event.target.getDuration() || 0,
                volume: 80,
                isMuted: false,
                error: null,
              }));
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              const ytState = event.data;

              if (ytState === window.YT.PlayerState.PLAYING) {
                setPlayerState((prev) => ({
                  ...prev,
                  isPlaying: true,
                  isBuffering: false,
                  duration: event.target.getDuration() || prev.duration,
                  error: null,
                }));
              } else if (ytState === window.YT.PlayerState.PAUSED) {
                setPlayerState((prev) => ({
                  ...prev,
                  isPlaying: false,
                  isBuffering: false,
                }));
              } else if (ytState === window.YT.PlayerState.BUFFERING) {
                setPlayerState((prev) => ({
                  ...prev,
                  isBuffering: true,
                }));
              } else if (ytState === window.YT.PlayerState.ENDED) {
                setPlayerState((prev) => ({
                  ...prev,
                  isPlaying: false,
                  isBuffering: false,
                  currentTime: prev.duration,
                }));
                if (onTrackEndedRef.current) {
                  onTrackEndedRef.current();
                }
              }
            },
            onError: (event) => {
              if (!isMounted) return;
              let errorMessage = 'Playback error occurred.';
              if (event.data === 101 || event.data === 150) {
                errorMessage = 'Video owner restricted embedding on this domain.';
              } else if (event.data === 100) {
                errorMessage = 'Video not found or removed.';
              } else if (event.data === 2) {
                errorMessage = 'Invalid video ID parameter.';
              }

              setPlayerState((prev) => ({
                ...prev,
                error: errorMessage,
                isPlaying: false,
                isBuffering: false,
              }));

              if (onErrorTrackRef.current) {
                onErrorTrackRef.current(errorMessage);
              }
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube Player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Load YouTube IFrame API script dynamically
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [containerId]);

  const play = useCallback(() => {
    try {
      playerRef.current?.playVideo();
    } catch (e) {
      console.warn('Play error:', e);
    }
  }, []);

  const pause = useCallback(() => {
    try {
      playerRef.current?.pauseVideo();
    } catch (e) {
      console.warn('Pause error:', e);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, pause, play]);

  const loadVideo = useCallback((videoId: string, autoPlay = true) => {
    try {
      if (playerRef.current) {
        if (autoPlay && typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById({
            videoId: videoId,
          });
        } else if (typeof playerRef.current.cueVideoById === 'function') {
          playerRef.current.cueVideoById({
            videoId: videoId,
          });
        }
        setPlayerState((prev) => ({
          ...prev,
          currentTime: 0,
          error: null,
        }));
      }
    } catch (e) {
      console.warn('Load video error:', e);
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    try {
      playerRef.current?.seekTo(seconds, true);
      setPlayerState((prev) => ({ ...prev, currentTime: seconds }));
    } catch (e) {
      console.warn('Seek error:', e);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    try {
      const clamped = Math.max(0, Math.min(100, volume));
      playerRef.current?.setVolume(clamped);
      if (clamped > 0 && playerRef.current?.isMuted()) {
        playerRef.current.unMute();
      }
      setPlayerState((prev) => ({ ...prev, volume: clamped, isMuted: clamped === 0 }));
    } catch (e) {
      console.warn('Set volume error:', e);
    }
  }, []);

  const toggleMute = useCallback(() => {
    try {
      if (playerRef.current) {
        if (playerRef.current.isMuted()) {
          playerRef.current.unMute();
          setPlayerState((prev) => ({ ...prev, isMuted: false }));
        } else {
          playerRef.current.mute();
          setPlayerState((prev) => ({ ...prev, isMuted: true }));
        }
      }
    } catch (e) {
      console.warn('Mute toggle error:', e);
    }
  }, []);

  return {
    playerRef,
    playerState,
    play,
    pause,
    togglePlay,
    loadVideo,
    seekTo,
    setVolume,
    toggleMute,
  };
}
