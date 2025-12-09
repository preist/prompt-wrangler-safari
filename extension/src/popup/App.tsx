import { SettingsProvider } from '@popup/state/SettingsContext';
import { IssuesProvider } from '@popup/state/IssuesContext';
import { AppLayout } from '@popup/layouts/AppLayout/AppLayout';
import { OnboardingScreen } from '@popup/screens/OnboardingScreen/OnboardingScreen';
import { useSettings } from '@popup/hooks/useSettings';

function AppContent() {
  const { hasCompletedOnboarding, completeOnboarding } = useSettings();

  if (!hasCompletedOnboarding) {
    return (
      <OnboardingScreen
        onComplete={() => {
          void completeOnboarding();
        }}
      />
    );
  }

  return <AppLayout />;
}

export function App() {
  return (
    <SettingsProvider>
      <IssuesProvider>
        <AppContent />
      </IssuesProvider>
    </SettingsProvider>
  );
}
