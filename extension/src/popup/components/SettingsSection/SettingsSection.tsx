import type { ReactNode } from 'react';
import './SettingsSection.scss';

interface SettingsSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection(props: SettingsSectionProps) {
  const { title, description, children } = props;

  return (
    <div className="settings-section">
      {title && <h3 className="settings-section__title">{title}</h3>}
      {description && <div className="settings-section__description">{description}</div>}
      {children}
    </div>
  );
}
