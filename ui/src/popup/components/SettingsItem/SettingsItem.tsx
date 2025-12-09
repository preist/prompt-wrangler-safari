import type { ReactNode } from 'react';
import './SettingsItem.scss';

interface SettingsItemProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsItem(props: SettingsItemProps) {
  const { title, description, children } = props;

  return (
    <div className="settings-item">
      <div className="settings-item__content">
        <div className="settings-item__title">{title}</div>
        {description && <div className="settings-item__description">{description}</div>}
      </div>
      {children}
    </div>
  );
}
