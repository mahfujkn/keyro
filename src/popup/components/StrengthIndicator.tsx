import React from 'react';
import { StrengthResult, StrengthLevel } from '../../types';

interface StrengthIndicatorProps {
  strength: StrengthResult;
}

export const StrengthIndicator: React.FC<StrengthIndicatorProps> = ({ strength }) => {
  const getStrengthColor = (level: StrengthLevel) => {
    switch (level) {
      case StrengthLevel.Weak:
        return 'var(--danger)';
      case StrengthLevel.Fair:
        return 'var(--warning)';
      case StrengthLevel.Strong:
        return 'var(--primary)';
      case StrengthLevel.VeryStrong:
        return 'var(--success)';
      default:
        return 'var(--surface-3)';
    }
  };

  const percentage = strength.score * 100;

  return (
    <>
      <div
        className="k-strength"
        role="meter"
        aria-label={`Password strength: ${strength.level}`}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="k-strength__bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getStrengthColor(strength.level),
          }}
        />
      </div>
      <div className="k-strength__label" style={{ color: getStrengthColor(strength.level) }}>
        {strength.level}
      </div>
    </>
  );
};
