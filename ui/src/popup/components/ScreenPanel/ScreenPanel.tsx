import type { ReactNode } from 'react';

interface ScreenPanelAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  show?: boolean;
}

interface ScreenPanelProps {
  title?: string;
  action?: ScreenPanelAction;
  children: ReactNode;
}

export function ScreenPanel(props: ScreenPanelProps) {
  const { title, action, children } = props;

  return (
    <div className="screen-panel">
      {(title ?? action) && (
        <div className="screen-panel__header">
          {title && <h2 className="screen-panel__title">{title}</h2>}
          {action && action.show !== false && (
            <button
              type="button"
              className="screen-panel__action-button"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
      <div className="screen-panel__content">{children}</div>
    </div>
  );
}
