import React from 'react';
import styles from './AmbientControls.module.css';
import { AmbientSettings } from '../../types/player';
import { CloudRain, Disc, Fan, Zap, Sparkles } from 'lucide-react';
import { playTactileClick } from '../../utils/sfx';

interface AmbientControlsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AmbientSettings;
  onToggleEnabled: () => void;
  onUpdateVolume: (key: keyof Omit<AmbientSettings, 'enabled'>, val: number) => void;
}

export const AmbientControls: React.FC<AmbientControlsProps> = ({
  isOpen,
  settings,
  onToggleEnabled,
  onUpdateVolume,
}) => {
  if (!isOpen) return null;

  const applyPreset = (preset: 'monsoon' | 'vinyl' | 'night') => {
    playTactileClick();
    if (!settings.enabled) {
      onToggleEnabled();
    }
    if (preset === 'monsoon') {
      onUpdateVolume('rain', 70);
      onUpdateVolume('vinyl', 20);
      onUpdateVolume('fan', 30);
      onUpdateVolume('crtHum', 15);
    } else if (preset === 'vinyl') {
      onUpdateVolume('rain', 0);
      onUpdateVolume('vinyl', 80);
      onUpdateVolume('fan', 20);
      onUpdateVolume('crtHum', 25);
    } else if (preset === 'night') {
      onUpdateVolume('rain', 30);
      onUpdateVolume('vinyl', 40);
      onUpdateVolume('fan', 50);
      onUpdateVolume('crtHum', 40);
    }
  };

  return (
    <div className={styles.ambientPopover}>
      {/* Header */}
      <div className={styles.ambientHeader}>
        <div className={styles.ambientTitle}>
          <Sparkles size={16} color="var(--amber-led)" />
          <span>Room Atmosphere</span>
        </div>
        <button
          onClick={() => {
            playTactileClick();
            onToggleEnabled();
          }}
          className={`${styles.toggleSwitch} ${settings.enabled ? styles.toggleSwitchOn : ''}`}
          title={settings.enabled ? 'Mute Ambience' : 'Enable Ambience'}
        >
          <div className={styles.toggleThumb} />
        </button>
      </div>

      {/* Sliders */}
      <div className={styles.fadersList} style={{ opacity: settings.enabled ? 1 : 0.45 }}>
        {/* Master Volume */}
        <div className={styles.faderRow}>
          <div className={styles.faderLabel}>
            <strong>Master</strong>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!settings.enabled}
            value={settings.masterVolume}
            onChange={(e) => onUpdateVolume('masterVolume', Number(e.target.value))}
            className={styles.faderInput}
          />
          <span className={styles.faderValue}>{settings.masterVolume}%</span>
        </div>

        {/* Rain */}
        <div className={styles.faderRow}>
          <div className={styles.faderLabel}>
            <CloudRain size={14} color="#38bdf8" />
            <span>Monsoon</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!settings.enabled}
            value={settings.rain}
            onChange={(e) => onUpdateVolume('rain', Number(e.target.value))}
            className={styles.faderInput}
          />
          <span className={styles.faderValue}>{settings.rain}%</span>
        </div>

        {/* Vinyl */}
        <div className={styles.faderRow}>
          <div className={styles.faderLabel}>
            <Disc size={14} color="#f59e0b" />
            <span>Vinyl Hiss</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!settings.enabled}
            value={settings.vinyl}
            onChange={(e) => onUpdateVolume('vinyl', Number(e.target.value))}
            className={styles.faderInput}
          />
          <span className={styles.faderValue}>{settings.vinyl}%</span>
        </div>

        {/* Ceiling Fan */}
        <div className={styles.faderRow}>
          <div className={styles.faderLabel}>
            <Fan size={14} color="#a3e635" />
            <span>Ceiling Fan</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!settings.enabled}
            value={settings.fan}
            onChange={(e) => onUpdateVolume('fan', Number(e.target.value))}
            className={styles.faderInput}
          />
          <span className={styles.faderValue}>{settings.fan}%</span>
        </div>

        {/* CRT Hum */}
        <div className={styles.faderRow}>
          <div className={styles.faderLabel}>
            <Zap size={14} color="#c084fc" />
            <span>CRT 50Hz</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!settings.enabled}
            value={settings.crtHum}
            onChange={(e) => onUpdateVolume('crtHum', Number(e.target.value))}
            className={styles.faderInput}
          />
          <span className={styles.faderValue}>{settings.crtHum}%</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className={styles.presetsRow}>
        <button onClick={() => applyPreset('monsoon')} className={styles.presetBtn}>
          🌧️ Monsoon
        </button>
        <button onClick={() => applyPreset('vinyl')} className={styles.presetBtn}>
          📻 Vinyl
        </button>
        <button onClick={() => applyPreset('night')} className={styles.presetBtn}>
          🌙 Late Night
        </button>
      </div>
    </div>
  );
};
