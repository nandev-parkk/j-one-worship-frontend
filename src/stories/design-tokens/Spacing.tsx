import React from 'react';

interface SpacingToken {
  name: string;
  variable: string;
  px: number;
}

const spacingTokens: SpacingToken[] = [
  { name: '0', variable: '--spacing-0', px: 0 },
  { name: '1', variable: '--spacing-1', px: 4 },
  { name: '2', variable: '--spacing-2', px: 8 },
  { name: '3', variable: '--spacing-3', px: 12 },
  { name: '4', variable: '--spacing-4', px: 16 },
  { name: '5', variable: '--spacing-5', px: 20 },
  { name: '6', variable: '--spacing-6', px: 24 },
  { name: '7', variable: '--spacing-7', px: 28 },
  { name: '8', variable: '--spacing-8', px: 32 },
  { name: '9', variable: '--spacing-9', px: 36 },
  { name: '10', variable: '--spacing-10', px: 40 },
  { name: '12', variable: '--spacing-12', px: 48 },
  { name: '14', variable: '--spacing-14', px: 56 },
  { name: '16', variable: '--spacing-16', px: 64 },
  { name: '20', variable: '--spacing-20', px: 80 },
  { name: '24', variable: '--spacing-24', px: 96 },
  { name: '32', variable: '--spacing-32', px: 128 },
];

export const Spacing: React.FC = () => {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold">
        Spacing (4px base grid)
      </h3>
      <div className="space-y-3">
        {spacingTokens.map((token) => (
          <div
            key={token.name}
            className="flex items-center gap-4 rounded-lg border border-gray-200 px-4 py-2"
          >
            <div className="w-28 shrink-0 text-right text-xs font-mono text-gray-400">
              <div>spacing-{token.name}</div>
              <div>{token.variable}</div>
            </div>
            <div className="flex-1">
              <div
                className="h-6 rounded-md [width:${Math.max(token.px, 4)}px]"
                style={{ backgroundColor: 'var(--design-blue-500)' }}
              />
            </div>
            <div className="w-16 shrink-0 text-right text-xs font-mono text-gray-400">
              {token.px}px
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
