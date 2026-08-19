import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ambientEngine } from '../components/AmbientControls/AmbientAudioEngine';
import { AmbientSettings } from '../types/player';

const defaultSettings: AmbientSettings = {
  enabled: false,
  masterVolume: 60,
  rain: 40,
  vinyl: 50,
  fan: 30,
  crtHum: 25,
};

export function useAmbientAudio() {
  const [settings, setSettings] = useLocalStorage<AmbientSettings>('retrobaja_ambient', defaultSettings);

  useEffect(() => {
    if (settings.enabled) {
      ambientEngine.start();
      ambientEngine.setMasterVolume(settings.masterVolume);
      ambientEngine.setRainVolume(settings.rain);
      ambientEngine.setVinylVolume(settings.vinyl);
      ambientEngine.setFanVolume(settings.fan);
      ambientEngine.setCrtHumVolume(settings.crtHum);
    } else {
      ambientEngine.setMasterVolume(0);
    }
  }, [settings]);

  const toggleEnabled = () => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const updateVolume = (key: keyof Omit<AmbientSettings, 'enabled'>, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    toggleEnabled,
    updateVolume,
  };
}
