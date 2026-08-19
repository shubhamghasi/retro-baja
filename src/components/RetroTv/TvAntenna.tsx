import React from 'react';

export const TvAntenna: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '42px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 5,
        marginBottom: '-6px',
      }}
    >
      {/* Central antenna mount base on TV roof */}
      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '14px',
          background: 'linear-gradient(180deg, #5c4533 0%, #2b1d14 100%)',
          borderRadius: '6px 6px 0 0',
          border: '1px solid #7d6048',
          borderBottom: 'none',
          boxShadow: '0 -2px 6px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Left Antenna Rod */}
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '18px',
            width: '3.5px',
            height: '48px',
            background: 'linear-gradient(90deg, #dcdcdc 0%, #8c8c8c 50%, #444444 100%)',
            transformOrigin: 'bottom center',
            transform: 'rotate(-32deg)',
            borderRadius: '2px',
            boxShadow: '-1px 2px 4px rgba(0,0,0,0.4)',
          }}
        >
          {/* Antenna Tip Sphere */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 80%)',
              boxShadow: '0 0 4px rgba(255, 215, 0, 0.4)',
            }}
          />
        </div>

        {/* Right Antenna Rod */}
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            right: '18px',
            width: '3.5px',
            height: '52px',
            background: 'linear-gradient(90deg, #dcdcdc 0%, #8c8c8c 50%, #444444 100%)',
            transformOrigin: 'bottom center',
            transform: 'rotate(28deg)',
            borderRadius: '2px',
            boxShadow: '1px 2px 4px rgba(0,0,0,0.4)',
          }}
        >
          {/* Antenna Tip Sphere */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 80%)',
              boxShadow: '0 0 4px rgba(255, 215, 0, 0.4)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
