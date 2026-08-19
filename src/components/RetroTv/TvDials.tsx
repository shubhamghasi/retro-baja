import React from 'react';
import { DialKnob } from '../Common/DialKnob';
import { PowerSwitch } from '../Common/PowerSwitch';
import { Channel } from '../../types/playlist';
import { Sparkles } from 'lucide-react';

interface TvDialsProps {
  isPowered: boolean;
  onTogglePower: () => void;
  activeChannel: Channel;
  channelIndex: number;
  totalChannels: number;
  onNextChannel: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isPlaying: boolean;
  onSurpriseMe: () => void;
}

export const TvDials: React.FC<TvDialsProps> = ({
  isPowered,
  onTogglePower,
  activeChannel,
  channelIndex,
  totalChannels,
  onNextChannel,
  volume,
  onVolumeChange,
  isPlaying,
  onSurpriseMe,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '12px 8px',
        gap: '12px',
        backgroundColor: 'var(--tv-speaker-bg)',
        borderRadius: '12px',
        border: '2px solid rgba(0,0,0,0.5)',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.05)',
      }}
    >
      {/* Vintage Emblem Badge */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '4px 6px',
          background: 'linear-gradient(180deg, #2b2219 0%, #17120c 100%)',
          borderRadius: '4px',
          border: '1px solid #634b34',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            color: 'var(--amber-led)',
            textTransform: 'uppercase',
            textShadow: '0 0 4px var(--amber-led-glow)',
          }}
        >
          BAJA VISION
        </span>
        <div
          style={{
            fontSize: '7px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '0.8px',
          }}
        >
          HI-FI SOLID STATE
        </div>
      </div>

      {/* Retro Channel Nixie/LED Display */}
      <div
        style={{
          width: '100%',
          background: '#08090a',
          padding: '6px 8px',
          borderRadius: '6px',
          border: '2px solid #23201c',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9), 0 0 4px rgba(255, 183, 3, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '2px',
          }}
        >
          <span
            style={{
              fontSize: '8px',
              fontFamily: 'var(--font-mono)',
              color: '#555',
              textTransform: 'uppercase',
            }}
          >
            CHANNEL
          </span>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isPowered && isPlaying ? 'var(--crt-green)' : '#222',
              boxShadow: isPowered && isPlaying ? '0 0 6px var(--crt-green)' : 'none',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-crt)',
            fontSize: '22px',
            lineHeight: 1,
            color: isPowered ? 'var(--amber-led)' : '#332712',
            textShadow: isPowered ? '0 0 8px var(--amber-led-glow)' : 'none',
            letterSpacing: '2px',
          }}
        >
          {isPowered ? activeChannel.channelNumber : '--'}
        </div>
        <div
          style={{
            fontSize: '8px',
            fontFamily: 'var(--font-body)',
            color: isPowered ? 'var(--text-secondary)' : '#444',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '85px',
            marginTop: '2px',
          }}
        >
          {isPowered ? activeChannel.name : 'OFFLINE'}
        </div>
      </div>

      {/* Main Channel Selector Rotary Knob */}
      <DialKnob
        label="CHANNEL"
        subLabel="CLICK TO TUNE"
        value={(channelIndex / (totalChannels || 1)) * 100}
        onClick={onNextChannel}
        size="md"
      />

      {/* Volume Knob */}
      <DialKnob
        label="VOLUME"
        subLabel={`${volume}%`}
        value={volume}
        onChange={onVolumeChange}
        size="sm"
      />

      {/* Surprise Me / Magic Button */}
      <button
        onClick={onSurpriseMe}
        title="Surprise Me (Random Song)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          background: 'linear-gradient(180deg, #33261a 0%, #1e150d 100%)',
          border: '1px solid #715539',
          borderRadius: '4px',
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}
      >
        <Sparkles size={11} color="var(--amber-led)" />
        <span>SURPRISE</span>
      </button>

      {/* Vintage Horizontal Speaker Slats */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          padding: '4px 6px',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: '#0a0807',
              borderRadius: '2px',
              boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>

      {/* Power Toggle Switch */}
      <PowerSwitch isOn={isPowered} onToggle={onTogglePower} />
    </div>
  );
};
