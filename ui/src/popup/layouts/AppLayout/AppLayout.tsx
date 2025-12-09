import { useState } from 'react';
import { Navigation } from '@popup/components/Navigation/Navigation';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import { IssuesFoundScreen } from '@popup/screens/IssuesFoundScreen/IssuesFoundScreen';
import { HistoryScreen } from '@popup/screens/HistoryScreen/HistoryScreen';
import { AllowlistScreen } from '@popup/screens/AllowlistScreen/AllowlistScreen';
import { SettingsScreen } from '@popup/screens/SettingsScreen/SettingsScreen';
import { Footer } from './components/Footer';
import type { Screen } from '@popup/components/Navigation/Navigation';

export function AppLayout() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('issues');

  return (
    <div className="app">
      <Navigation className="app__navigation" current={currentScreen} onChange={setCurrentScreen} />
      <div className="app__protected-mode-toggle">
        <ProtectedModeToggle />
      </div>

      <div className="app__content">
        {currentScreen === 'issues' && <IssuesFoundScreen />}
        {currentScreen === 'history' && <HistoryScreen />}
        {currentScreen === 'allowlist' && <AllowlistScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      <Footer />
    </div>
  );
}
