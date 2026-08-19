import React from 'react';
import styles from './Header.module.css';
import { TvTheme, AmbientSettings } from '../../types/player';
import { Tv, Sparkles, HelpCircle } from 'lucide-react';
import { AmbientControls } from '../AmbientControls/AmbientControls';
import { playTactileClick } from '../../utils/sfx';

interface HeaderProps {
  currentTheme: TvTheme;
  onSelectTheme: (theme: TvTheme) => void;
  ambientSettings: AmbientSettings;
  onToggleAmbient: () => void;
  onUpdateAmbientVolume: (key: keyof Omit<AmbientSettings, 'enabled'>, val: number) => void;
  isAmbientOpen: boolean;
  onToggleAmbientOpen: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onSelectTheme,
  ambientSettings,
  onToggleAmbient,
  onUpdateAmbientVolume,
  isAmbientOpen,
  onToggleAmbientOpen,
  onOpenShortcuts,
}) => {
  return (
    <header className={styles.headerContainer}>
      {/* Brand Logo & Title */}
      <div className={styles.brandGroup}>
        <div className={styles.brandLogo}>
          <Tv size={20} color="var(--amber-led)" />
        </div>
        <div className={styles.brandTitleGroup}>
          <h1 className={styles.brandName}>RETROBAJA</h1>
          <span className={styles.brandTagline}>90s Television & Music Experience</span>
        </div>
      </div>

      {/* Top Actions: Theme dots, Ambient menu, Shortcuts Help */}
      <div className={styles.actionsGroup}>
        {/* Theme Picker */}
        <div className={styles.themeSelector} title="Change TV Cabinet Finish">
          <button
            onClick={() => {
              playTactileClick();
              onSelectTheme('teakwood');
            }}
            className={`${styles.themeDot} ${currentTheme === 'teakwood' ? styles.themeDotActive : ''}`}
            style={{ backgroundColor: '#68341b' }}
            title="Vintage Teakwood"
          />
          <button
            onClick={() => {
              playTactileClick();
              onSelectTheme('charcoal');
            }}
            className={`${styles.themeDot} ${currentTheme === 'charcoal' ? styles.themeDotActive : ''}`}
            style={{ backgroundColor: '#2c323d' }}
            title="80s Charcoal Slate"
          />
          <button
            onClick={() => {
              playTactileClick();
              onSelectTheme('retromint');
            }}
            className={`${styles.themeDot} ${currentTheme === 'retromint' ? styles.themeDotActive : ''}`}
            style={{ backgroundColor: '#2a5652' }}
            title="Retro Sage Mint"
          />
        </div>

        {/* Ambient Room Audio Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              playTactileClick();
              onToggleAmbientOpen();
            }}
            className={`${styles.actionBtn} ${ambientSettings.enabled ? styles.actionBtnActive : ''}`}
            title="Room Ambience Sounds (Rain, Vinyl, Fan, CRT)"
          >
            <Sparkles size={15} color={ambientSettings.enabled ? 'var(--amber-led)' : 'currentColor'} />
            <span className={styles.actionLabel}>
              {ambientSettings.enabled ? 'Atmosphere ON' : 'Atmosphere'}
            </span>
          </button>

          {/* Ambient Controls Dropdown */}
          <AmbientControls
            isOpen={isAmbientOpen}
            onClose={onToggleAmbientOpen}
            settings={ambientSettings}
            onToggleEnabled={onToggleAmbient}
            onUpdateVolume={onUpdateAmbientVolume}
          />
        </div>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => {
            playTactileClick();
            onOpenShortcuts();
          }}
          className={styles.actionBtn}
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle size={15} />
          <span className={styles.actionLabel}>Shortcuts</span>
        </button>
      </div>
    </header>
  );
};
