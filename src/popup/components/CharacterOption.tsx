import React from 'react';

interface CharacterOptionProps {
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const CharacterOption: React.FC<CharacterOptionProps> = ({
  label,
  hint,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange();
    }
  };

  return (
    <button
      className="k-char-option"
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      title={disabled ? "You must select at least one character type" : undefined}
    >
      <div className="k-checkbox">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span>{label}</span>
      <span className="k-char-option__hint">{hint}</span>
    </button>
  );
};
