import { useState, useEffect } from 'react';
import { classnames } from '@lib/utils/classnames';
import ShieldIcon from './assets/shield.svg?react';
import CalendarIcon from './assets/calendar.svg?react';
import AllowlistIcon from './assets/allowlist.svg?react';
import SettingsIcon from './assets/settings.svg?react';

export type Screen = 'issues' | 'history' | 'allowlist' | 'settings';

interface NavigationProps {
  current: Screen;
  className?: string;
  onChange: (screen: Screen) => void;
}

export function Navigation(props: NavigationProps) {
  const { current, className, onChange } = props;
  const [jiggle, setJiggle] = useState(false);

  useEffect(() => {
    const handleAllowlistChange = () => {
      setJiggle(true);
      setTimeout(() => {
        setJiggle(false);
      }, 600);
    };

    window.addEventListener('allowlist-item-added', handleAllowlistChange);

    return () => {
      window.removeEventListener('allowlist-item-added', handleAllowlistChange);
    };
  }, []);

  return (
    <nav className={classnames('navigation', className)}>
      <button
        type="button"
        className={`navigation__button ${current === 'issues' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('issues');
        }}
      >
        <ShieldIcon className="navigation__icon" />
        <span className="navigation__label">Issues</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'history' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('history');
        }}
      >
        <CalendarIcon className="navigation__icon" />
        <span className="navigation__label">History</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'allowlist' ? 'navigation__button--active' : ''} ${jiggle ? 'navigation__button--jiggle' : ''}`}
        onClick={() => {
          onChange('allowlist');
        }}
      >
        <AllowlistIcon className="navigation__icon" />
        <span className="navigation__label">Allowlist</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'settings' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('settings');
        }}
      >
        <SettingsIcon className="navigation__icon" />
        <span className="navigation__label">Settings</span>
      </button>
    </nav>
  );
}
