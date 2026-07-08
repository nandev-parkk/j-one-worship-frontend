import React from 'react';

interface RadiusToken {
  name: string;
  variable: string;
  value: string;
}

const radiusTokens: RadiusToken[] = [
  { name: 'none', variable: '--radius-none', value: 'var(--radius-none)' },
  { name: 'sm', variable: '--radius-sm', value: 'var(--radius-sm)' },
  { name: 'md', variable: '--radius-md', value: 'var(--radius-md)' },
  { name: 'lg', variable: '--radius-lg', value: 'var(--radius-lg)' },
  { name: 'xl', variable: '--radius-xl', value: 'var(--radius-xl)' },
  { name: '2xl', variable: '--radius-2xl', value: 'var(--radius-2xl)' },
  { name: 'full', variable: '--radius-full', value: 'var(--radius-full)' },
];

export const Radius: React.FC = () => {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold">Border Radius</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {radiusTokens.map((token) => (
          <div
            key={token.name}
            className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 p-6"
          >
            <div
              className="flex h-24 w-24 items-center justify-center border border-gray-300 bg-gray-50"
              style={{ borderRadius: token.value }}
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
