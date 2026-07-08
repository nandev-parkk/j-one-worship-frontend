import React from 'react';

interface FontSize {
  name: string;
  variable: string;
  value: string;
  px: number;
}

interface FontWeight {
  name: string;
  variable: string;
  value: number;
}

const fontSizes: FontSize[] = [
  { name: 'xs', variable: '--font-size-xs', value: 'var(--font-size-xs)', px: 12 },
  { name: 'sm', variable: '--font-size-sm', value: 'var(--font-size-sm)', px: 14 },
  { name: 'base', variable: '--font-size-base', value: 'var(--font-size-base)', px: 16 },
  { name: 'lg', variable: '--font-size-lg', value: 'var(--font-size-lg)', px: 18 },
  { name: 'xl', variable: '--font-size-xl', value: 'var(--font-size-xl)', px: 20 },
  { name: '2xl', variable: '--font-size-2xl', value: 'var(--font-size-2xl)', px: 24 },
  { name: '3xl', variable: '--font-size-3xl', value: 'var(--font-size-3xl)', px: 30 },
  { name: '4xl', variable: '--font-size-4xl', value: 'var(--font-size-4xl)', px: 36 },
  { name: '5xl', variable: '--font-size-5xl', value: 'var(--font-size-5xl)', px: 48 },
];

const fontWeights: FontWeight[] = [
  { name: 'Thin', variable: '--font-weight-thin', value: 100 },
  { name: 'Light', variable: '--font-weight-light', value: 300 },
  { name: 'Regular', variable: '--font-weight-regular', value: 400 },
  { name: 'Medium', variable: '--font-weight-medium', value: 500 },
  { name: 'Semibold', variable: '--font-weight-semibold', value: 600 },
  { name: 'Bold', variable: '--font-weight-bold', value: 700 },
  { name: 'Extrabold', variable: '--font-weight-extrabold', value: 800 },
];

export const Typography: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Font Family */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Font Family</h3>
        <div className="rounded-lg border border-gray-200 p-6">
          <p className="mb-1 text-sm text-gray-500">--font-family</p>
          <p style={{ fontFamily: 'var(--font-family)' }}>
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="mt-2 text-xs font-mono text-gray-400">
            Pretendard, system-ui, -apple-system, sans-serif
          </p>
        </div>
      </section>

      {/* Font Sizes */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Font Sizes</h3>
        <div className="space-y-3">
          {fontSizes.map((size) => (
            <div
              key={size.name}
              className="flex items-baseline gap-4 rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="w-20 shrink-0 text-right text-xs font-mono text-gray-400">
                {size.name}
                <br />
                {size.variable}
              </div>
              <div className="flex-1">
                <span style={{ fontSize: size.px }}>
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
              <div className="w-16 shrink-0 text-right text-xs font-mono text-gray-400">
                {size.px}px
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weights */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Font Weights</h3>
        <div className="space-y-3">
          {fontWeights.map((weight) => (
            <div
              key={weight.name}
              className="flex items-baseline gap-4 rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="w-20 shrink-0 text-right text-xs font-mono text-gray-400">
                {weight.name}
                <br />
                {weight.variable}
              </div>
              <div className="flex-1">
                <span style={{ fontWeight: weight.value, fontSize: 20 }}>
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
              <div className="w-16 shrink-0 text-right text-xs font-mono text-gray-400">
                {weight.value}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
