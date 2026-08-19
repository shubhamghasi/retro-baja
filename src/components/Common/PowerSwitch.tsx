import React from 'react';
import { playTactileClick } from '../../utils/sfx';

interface PowerSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
}

export const PowerSwitch: React.FC<PowerSwitchProps> = ({
  isOn,
  onToggle,
  label = 'POWER',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    onToggle();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        userSelect: 'none',
      }}
    >
      <button
        onClick={handleClick}
        title={isOn ? 'Turn TV Off' : 'Turn TV On'}
        style={{
          width: '38px',
          height: '24px',
          borderRadius: '4px',
          background: isOn
            ? 'linear-gradient(180deg, #2a2520 0%, #15110e 100%)'
            : 'linear-gradient(180deg, #15110e 0%, #2a2520 100%)',
          border: '2px solid #5a4634',
          boxShadow: isOn
            ? 'inset 0 2px 4px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.4)'
            : 'inset 0 -2px 4px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.4)',
          position: 'relative',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOn ? 'flex-end' : 'flex-start',
          transition: 'all 0.15s ease',
        }}
      >
        <div
          style={{
            width: '14px',
            height: '16px',
            borderRadius: '2px',
            background: isOn
              ? 'linear-gradient(180deg, #d4af37 0%, #8b6508 100%)'
              : 'linear-gradient(180deg, #554433 0%, #2b2219 100%)',
            boxShadow: isOn
              ? '0 0 6px rgba(212, 175, 55, 0.6)'
              : 'none',
          }}
        />
      </button>

      {/* Pilot bulb indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isOn ? '#ef4444' : '#3a1818',
            boxShadow: isOn
              ? '0 0 8px #ef4444, 0 0 16px rgba(239, 68, 68, 0.6)'
              : 'none',
            border: '1px solid #2a1111',
            transition: 'all 0.2s ease',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            color: isOn ? 'var(--text-primary)' : 'var(--text-muted)',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
