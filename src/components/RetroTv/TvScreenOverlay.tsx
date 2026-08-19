import React from 'react';
import { Play, Tv, Sparkles } from 'lucide-react';
import { Track } from '../../types/playlist';

interface TvScreenOverlayProps {
  isPowered: boolean;
  onTurnOn: () => void;
  currentTrack: Track;
  isBuffering: boolean;
  error: string | null;
}

export const TvScreenOverlay: React.FC<TvScreenOverlayProps> = ({
  isPowered,
  onTurnOn,
  currentTrack,
  isBuffering,
  error,
}) => {
  // If TV is Powered OFF, display retro glass off-state & Start Watching hero
  if (!isPowered) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#07080a',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          borderRadius: '16px',
          backgroundImage: 'radial-gradient(circle at 50% 40%, #151a22 0%, #050608 80%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.95)',
        }}
      >
        {/* CRT Glass highlight curved reflection */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 60%, transparent 100%)',
            borderRadius: '16px 16px 50% 50%',
            pointerEvents: 'none',
          }}
        />

        {/* Vintage Off Screen Center Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
          }}
        >
          <Tv size={32} color="var(--amber-led)" />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 3.5vw, 28px)',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            letterSpacing: '0.5px',
          }}
        >
          Tune Into Retro Memories
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            maxWidth: '360px',
            lineHeight: 1.5,
            marginBottom: '24px',
          }}
        >
          Experience 90s Bollywood, timeless Ghazals, and Indie anthems inside a vintage CRT living room set.
        </p>

        {/* Big Start Button */}
        <button
          onClick={onTurnOn}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            backgroundColor: 'var(--amber-led)',
            color: '#1a1003',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 700,
            borderRadius: '999px',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4), 0 0 0 3px rgba(245, 158, 11, 0.2)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(245, 158, 11, 0.6), 0 0 0 4px rgba(245, 158, 11, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.4), 0 0 0 3px rgba(245, 158, 11, 0.2)';
          }}
        >
          <Play size={18} fill="#1a1003" />
          <span>START WATCHING</span>
        </button>

        {/* Featured track snippet */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          <Sparkles size={12} color="var(--amber-led)" />
          <span>Starting with: {currentTrack.title}</span>
        </div>
      </div>
    );
  }

  // When Powered ON, render ONLY non-interactive surrounding screen effects (pointer-events: none)
  return (
    <>
      {/* Curved CRT glass corner vignette and soft ambient sheen (Strictly pointer-events: none) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          boxShadow: 'inset 0 0 28px rgba(0, 0, 0, 0.75), inset 0 2px 4px rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Subtle CRT top curved glass reflection */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
          borderRadius: '12px 12px 40% 40%',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 8px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid var(--amber-led)',
            borderRadius: '4px',
            color: 'var(--amber-led)',
            fontFamily: 'var(--font-crt)',
            fontSize: '14px',
            letterSpacing: '1px',
            pointerEvents: 'none',
            zIndex: 6,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--amber-led)',
              animation: 'pulseGlow 1s infinite ease-in-out',
            }}
          />
          BUFFERING...
        </div>
      )}

      {/* Error notification banner */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            padding: '8px 12px',
            background: 'rgba(20, 10, 10, 0.92)',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            zIndex: 6,
            textAlign: 'center',
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </>
  );
};
