interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  large?: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle(props: ToggleProps) {
  const { label, description, checked, disabled, large, onChange } = props;

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`toggle ${disabled ? 'toggle--disabled' : ''}`}>
      <div className="toggle__content">
        <div className="toggle__label">{label}</div>
        {description && <div className="toggle__description">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={`toggle__switch ${checked ? 'toggle__switch--checked' : ''} ${large ? 'toggle__switch--large' : ''}`}
        onClick={handleChange}
      >
        <span className="toggle__switch-handle" />
      </button>
    </div>
  );
}
