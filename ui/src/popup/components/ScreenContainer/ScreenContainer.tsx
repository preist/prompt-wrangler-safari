import type { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
}

export function ScreenContainer(props: ScreenContainerProps) {
  const { children } = props;

  return <div className="screen-container">{children}</div>;
}
