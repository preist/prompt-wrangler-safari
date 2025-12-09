import { useSettings } from '@popup/hooks/useSettings';
import { Toggle } from '@popup/components/Toggle/Toggle';
import cowboyEnabledImg from './assets/cowboy-enabled.png';
import cowboyDisabledImg from './assets/cowboy-disabled.png';

export function ProtectedModeToggle() {
  const { protectedMode, toggleProtectedMode } = useSettings();

  return (
    <div className="protected-mode-toggle">
      <div className="protected-mode-toggle__illustration">
        <img
          src={protectedMode ? cowboyEnabledImg : cowboyDisabledImg}
          alt={protectedMode ? 'Protected mode enabled' : 'Protected mode disabled'}
          className="protected-mode-toggle__icon"
        />
      </div>
      <Toggle label="Protected Mode" checked={protectedMode} onChange={toggleProtectedMode} large />
    </div>
  );
}
