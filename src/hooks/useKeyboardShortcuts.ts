import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleChannel: () => void;
  onToggleFullscreen: () => void;
  onToggleLights: () => void;
  onToggleAmbient: () => void;
  onToggleHelp: () => void;
  onEscape: () => void;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onNext,
  onPrev,
  onToggleMute,
  onToggleShuffle,
  onCycleChannel,
  onToggleFullscreen,
  onToggleLights,
  onToggleAmbient,
  onToggleHelp,
  onEscape,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          target.blur();
          onEscape();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'n':
        case 'arrowright':
          e.preventDefault();
          onNext();
          break;
        case 'p':
        case 'arrowleft':
          e.preventDefault();
          onPrev();
          break;
        case 'm':
          e.preventDefault();
          onToggleMute();
          break;
        case 's':
          e.preventDefault();
          onToggleShuffle();
          break;
        case 'c':
          e.preventDefault();
          onCycleChannel();
          break;
        case 'f':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case 'l':
          e.preventDefault();
          onToggleLights();
          break;
        case 'a':
          e.preventDefault();
          onToggleAmbient();
          break;
        case '?':
        case 'h':
          e.preventDefault();
          onToggleHelp();
          break;
        case 'escape':
          e.preventDefault();
          onEscape();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onTogglePlay,
    onNext,
    onPrev,
    onToggleMute,
    onToggleShuffle,
    onCycleChannel,
    onToggleFullscreen,
    onToggleLights,
    onToggleAmbient,
    onToggleHelp,
    onEscape,
  ]);
}
