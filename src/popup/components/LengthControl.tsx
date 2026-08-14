import React from 'react';

interface LengthControlProps {
  length: number;
  onChange: (length: number) => void;
}

export const LengthControl: React.FC<LengthControlProps> = ({ length, onChange }) => {
  const min = 4;
  const max = 64;

  const handleMinus = () => {
    if (length > min) onChange(length - 1);
  };

  const handlePlus = () => {
    if (length < max) onChange(length + 1);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  // Calculate fill percentage for the slider track
  const fillPercent = ((length - min) / (max - min)) * 100;

  return (
    <div className="k-length-control">
      <div className="k-length-control__header">
        <span className="k-length-control__label">Password Length</span>
        <span className="k-length-control__value">{length}</span>
      </div>
      <div className="k-length-control__row">
        <button
          className="k-length-control__btn"
          onClick={handleMinus}
          disabled={length <= min}
          aria-label="Decrease length"
          title="Decrease"
        >
          −
        </button>
        <input
          type="range"
          className="k-length-control__slider"
          min={min}
          max={max}
          step="1"
          value={length}
          onChange={handleSliderChange}
          aria-label="Password length slider"
          aria-valuetext={`${length} characters`}
          style={{ '--slider-fill': `${fillPercent}%` } as React.CSSProperties}
        />
        <button
          className="k-length-control__btn"
          onClick={handlePlus}
          disabled={length >= max}
          aria-label="Increase length"
          title="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
};
