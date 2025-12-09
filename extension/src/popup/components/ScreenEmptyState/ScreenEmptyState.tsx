interface ScreenEmptyStateProps {
  title: string;
  description: string;
}

export function ScreenEmptyState(props: ScreenEmptyStateProps) {
  const { title, description } = props;

  return (
    <div className="screen-empty-state">
      <div className="screen-empty-state__title">{title}</div>
      <div className="screen-empty-state__description">{description}</div>
    </div>
  );
}
