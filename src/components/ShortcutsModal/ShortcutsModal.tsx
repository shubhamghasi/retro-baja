import React from 'react';
import styles from './ShortcutsModal.module.css';
import { X, Keyboard } from 'lucide-react';
import { playTactileClick } from '../../utils/sfx';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { label: 'Play / Pause', key: 'Space' },
    { label: 'Next Track', key: 'N or →' },
    { label: 'Previous Track', key: 'P or ←' },
    { label: 'Mute / Unmute', key: 'M' },
    { label: 'Toggle Shuffle', key: 'S' },
    { label: 'Cycle Channel', key: 'C' },
    { label: 'Cinema Lights', key: 'L' },
    { label: 'Fullscreen TV', key: 'F' },
    { label: 'Room Ambience', key: 'A' },
    { label: 'Close / Dismiss', key: 'Esc' },
  ];

  return (
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.modalOverlayOpen : ''}`}
      onClick={onClose}
    >
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={20} color="var(--amber-led)" />
            <h3 className={styles.modalTitle}>Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className={styles.closeBtn}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.shortcutsGrid}>
          {shortcuts.map((item, i) => (
            <div key={i} className={styles.shortcutItem}>
              <span className={styles.shortcutLabel}>{item.label}</span>
              <kbd className={styles.kbdKey}>{item.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
