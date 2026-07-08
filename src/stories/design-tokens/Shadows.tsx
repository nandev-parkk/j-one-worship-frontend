import React from 'react';

interface ShadowToken {
  name: string;
  variable: string;
  value: string;
}

const shadowTokens: ShadowToken[] = [
  {
    name: 'sm',
    variable: '--shadow-sm',
    value: 'var(--shadow-sm)',
  },
  {
    name: 'md',
    variable: '--shadow-md',
    value: 'var(--shadow-md)',
  },
  {
    name: 'lg',
    variable: '--shadow-lg',
    value: 'var(--shadow-lg)',
  },
  {
    name: 'xl',
    variable: '--shadow-xl',
    value: 'var(--shadow-xl)',
  },
  {
    name: '2xl',
    variable: '--shadow-2xl',
    value: 'var(--shadow-2xl)',
  },
];

export const Shadows: React.FC = () => {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold">Shadows</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shadowTokens.map((token) => (
          <div
            key={token.name}
            className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-6"
          >
            <div
              className="flex h-24 w-24 items-center justify-center rounded-md bg-white"
              style={{ boxShadow: token.value }}
            >
              <span className="text-xs font-medium text-gray-500">
                {token.name}
              </span>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{token.name}</div>
              <div className="text-xs font-mono text-gray-400">
                {token.variable}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
