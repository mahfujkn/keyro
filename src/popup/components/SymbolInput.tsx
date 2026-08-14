import React from 'react';

interface SymbolInputProps {
  symbols: string;
  onSymbolsChange: (symbols: string) => void;
  onReset: () => void;
}

export const SymbolInput: React.FC<SymbolInputProps> = ({ symbols, onSymbolsChange, onReset }) => {
  return (
    <div className="k-symbol-input">
      <input
        type="text"
        className="k-symbol-input__field"
        value={symbols}
        onChange={(e) => onSymbolsChange(e.target.value)}
        aria-label="Custom symbols"
        placeholder="Enter custom symbols..."
      />
      <button className="k-symbol-input__reset" onClick={onReset} aria-label="Reset symbols">
        Reset
      </button>
    </div>
  );
};
