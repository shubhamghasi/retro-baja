import React, { useState } from 'react';
import { playKnobClick } from '../../utils/sfx';

interface DialKnobProps {
  label: string;
  subLabel?: string;
  value: number; // 0 to 100 or specific rotation degrees
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const DialKnob: React.FC<DialKnobProps> = ({
  label,
  subLabel,
  value,
  min = 0,
  max = 100,
  step = 10,
  onChange,
  onClick,
  size = 'md',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Map value to angle (-135deg to +135deg = 270deg sweep)
  const percentage = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const rotationDeg = -135 + percentage * 270;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playKnobClick();
    if (onClick) {
      onClick();
    } else if (onChange) {
      const nextVal = value + step > max ? min : value + step;
      onChange(nextVal);
    }
  };

  const sizePx = size === 'sm' ? 44 : size === 'lg' ? 68 : 54;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        userSelect: 'none',
      }}
    >
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`${label}: ${value}`}
        style={{
          width: `${sizePx}px`,
          height: `${sizePx}px`,
          borderRadius: '50%',
          background: 'var(--tv-knob-bg)',
          border: `2px solid ${isHovered ? 'var(--tv-knob-rim)' : '#5a4634'}`,
          boxShadow: isHovered
            ? '0 4px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2), 0 0 8px var(--tv-accent-glow)'
            : '0 4px 8px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.15)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer ribbed texture */}
        <div
          style={{
            position: 'absolute',
            inset: '3px',
            borderRadius: '50%',
            border: '1px dashed rgba(255,255,255,0.12)',
          }}
        />

        {/* Center brushed cap with rotation indicator notch */}
        <div
          style={{
            width: `${sizePx - 14}px`,
            height: `${sizePx - 14}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #3d342d 0%, #171310 100%)',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.6)',
            transform: `rotate(${rotationDeg}deg)`,
            transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)',
            position: 'relative',
          }}
        >
          {/* Dial notch */}
          <div
            style={{
              position: 'absolute',
              top: '3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              height: `${(sizePx - 14) * 0.35}px`,
              background: 'var(--tv-knob-rim)',
              borderRadius: '2px',
              boxShadow: '0 0 4px var(--tv-accent)',
            }}
          />
        </div>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}
      >
        {label}
      </span>
      {subLabel && (
        <span
          style={{
            fontFamily: 'var(--font-crt)',
            fontSize: '11px',
            color: 'var(--amber-led)',
            marginTop: '-2px',
          }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};
