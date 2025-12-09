import { useContext } from 'react';
import { SettingsContext } from '@popup/state/SettingsContext';

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
