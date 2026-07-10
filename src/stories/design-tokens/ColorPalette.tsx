import React from 'react';

/* ──────────────────────────── Types ──────────────────────────── */

interface ColorStop {
  name: string;
  variable: string;
  hex: string;
}

interface ColorGroup {
  label: string;
  colors: ColorStop[];
  highlighted?: boolean;
}

/* ──────────────────────────── Palettes ──────────────────────────── */

const neutralGroup: ColorGroup = {
  label: 'Neutral (Gray)',
  colors: [
    { name: '100', variable: '--design-gray-100', hex: '#F7F7F7' },
    { name: '200', variable: '--design-gray-200', hex: '#E8E8E8' },
    { name: '300', variable: '--design-gray-300', hex: '#D1D1D1' },
    { name: '400', variable: '--design-gray-400', hex: '#A9A9A9' },
    { name: '500', variable: '--design-gray-500', hex: '#8F8F8F' },
    { name: '600', variable: '--design-gray-600', hex: '#6B6B6B' },
    { name: '700', variable: '--design-gray-700', hex: '#4A4A4A' },
    { name: '800', variable: '--design-gray-800', hex: '#333333' },
    { name: '900', variable: '--design-gray-900', hex: '#1A1A1A' },
  ],
};

const blueGroup: ColorGroup = {
  label: 'Blue (Primary Palette)',
  highlighted: true,
  colors: [
    { name: '100', variable: '--design-blue-100', hex: '#E8F1FB' },
    { name: '200', variable: '--design-blue-200', hex: '#C5D9F3' },
    { name: '300', variable: '--design-blue-300', hex: '#9BBEEB' },
    { name: '400', variable: '--design-blue-400', hex: '#6A9DE0' },
    { name: '500', variable: '--design-blue-500', hex: '#2977DC' },
    { name: '600', variable: '--design-blue-600', hex: '#2263B5' },
    { name: '700', variable: '--design-blue-700', hex: '#1B4F96' },
    { name: '800', variable: '--design-blue-800', hex: '#153B73' },
    { name: '900', variable: '--design-blue-900', hex: '#0F2B54' },
  ],
};

const accentGroups: ColorGroup[] = [
  {
    label: 'Green',
    colors: [
      { name: '100', variable: '--design-green-100', hex: '#DCFCE7' },
      { name: '200', variable: '--design-green-200', hex: '#BBF7D0' },
      { name: '300', variable: '--design-green-300', hex: '#78E7A0' },
      { name: '400', variable: '--design-green-400', hex: '#34D399' },
      { name: '500', variable: '--design-green-500', hex: '#22C55E' },
      { name: '600', variable: '--design-green-600', hex: '#16A34A' },
      { name: '700', variable: '--design-green-700', hex: '#15803D' },
      { name: '800', variable: '--design-green-800', hex: '#166534' },
      { name: '900', variable: '--design-green-900', hex: '#14532D' },
    ],
  },
  {
    label: 'Orange',
    colors: [
      { name: '100', variable: '--design-orange-100', hex: '#FFF7ED' },
      { name: '200', variable: '--design-orange-200', hex: '#FEE8DF' },
      { name: '300', variable: '--design-orange-300', hex: '#FED7AA' },
      { name: '400', variable: '--design-orange-400', hex: '#FDBA74' },
      { name: '500', variable: '--design-orange-500', hex: '#F97316' },
      { name: '600', variable: '--design-orange-600', hex: '#EA580C' },
      { name: '700', variable: '--design-orange-700', hex: '#C2410C' },
      { name: '800', variable: '--design-orange-800', hex: '#9A3412' },
      { name: '900', variable: '--design-orange-900', hex: '#7C2D12' },
    ],
  },
  {
    label: 'Purple',
    colors: [
      { name: '100', variable: '--design-purple-100', hex: '#F3E8FF' },
      { name: '200', variable: '--design-purple-200', hex: '#E9D5FF' },
      { name: '300', variable: '--design-purple-300', hex: '#D8B4FE' },
      { name: '400', variable: '--design-purple-400', hex: '#C084FC' },
      { name: '500', variable: '--design-purple-500', hex: '#A855F7' },
      { name: '600', variable: '--design-purple-600', hex: '#9140D9' },
      { name: '700', variable: '--design-purple-700', hex: '#7E22CE' },
      { name: '800', variable: '--design-purple-800', hex: '#6B21A8' },
      { name: '900', variable: '--design-purple-900', hex: '#581C87' },
    ],
  },
  {
    label: 'Red',
    colors: [
      { name: '100', variable: '--design-red-100', hex: '#FDE8E8' },
      { name: '200', variable: '--design-red-200', hex: '#FECFCA' },
      { name: '300', variable: '--design-red-300', hex: '#FDA5A5' },
      { name: '400', variable: '--design-red-400', hex: '#EF4444' },
      { name: '500', variable: '--design-red-500', hex: '#D92020' },
      { name: '600', variable: '--design-red-600', hex: '#B91C1C' },
      { name: '700', variable: '--design-red-700', hex: '#991B1B' },
      { name: '800', variable: '--design-red-800', hex: '#7F1D1D' },
      { name: '900', variable: '--design-red-900', hex: '#6B1A1A' },
    ],
  },
  {
    label: 'Yellow',
    colors: [
      { name: '100', variable: '--design-yellow-100', hex: '#FEFCE8' },
      { name: '200', variable: '--design-yellow-200', hex: '#FEF9C3' },
      { name: '300', variable: '--design-yellow-300', hex: '#FEF08A' },
      { name: '400', variable: '--design-yellow-400', hex: '#FACC15' },
      { name: '500', variable: '--design-yellow-500', hex: '#EAB308' },
      { name: '600', variable: '--design-yellow-600', hex: '#CA8A04' },
      { name: '700', variable: '--design-yellow-700', hex: '#A16207' },
      { name: '800', variable: '--design-yellow-800', hex: '#854D0E' },
      { name: '900', variable: '--design-yellow-900', hex: '#713F12' },
    ],
  },
];

/* ──────────────────────────── Gradients ──────────────────────────── */

interface GradientDef {
  name: string;
  variable: string;
  from: string;
  to: string;
}

const gradients: GradientDef[] = [
  {
    name: 'Gradient Primary',
    variable: '--gradient-primary',
    from: '#2977DC',
    to: '#6A9DE0',
  },
  {
    name: 'Gradient Subtle',
    variable: '--gradient-subtle',
    from: '#E8F1FB',
    to: '#C5D9F3',
  },
];

/* ──────────────────────────── Glows ──────────────────────────── */

interface GlowDef {
  name: string;
  variable: string;
  color: string;
  boxBg: string;
}

const glows: GlowDef[] = [
  {
    name: 'Glow Blue',
    variable: '--glow-blue',
    color: '#2977DC',
    boxBg: '#E8F1FB',
  },
];

/* ──────────────────────────── Helpers ──────────────────────────── */

function textColorFor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.4 ? '#1A1A1A' : '#FFFFFF';
}

/* ──────────────────────────── Components ──────────────────────────── */

/**
 * Gradient heading text using clip-text
 */
const GradientHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2
    className="text-2xl font-bold bg-gradient-to-r from-[#2977DC] to-[#6A9DE0] bg-clip-text text-transparent"
  >
    {children}
  </h2>
);

/**
 * Section heading with blue accent
 */
const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="mb-4 text-lg font-semibold text-[#2977DC]">
    {children}
  </h3>
);

/**
 * White card with soft shadow
 */
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`rounded-xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

/**
 * Individual color swatch
 */
const ColorSwatch: React.FC<{
  color: ColorStop;
  isPrimary?: boolean;
}> = ({ color, isPrimary }) => {
  const textColor = textColorFor(color.hex);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-20 w-full items-end justify-center rounded-lg p-1 text-xs font-mono font-medium leading-none transition-shadow duration-200 ${isPrimary ? 'ring-2 ring-blue-500/30 shadow-md' : 'shadow-sm'}`}
        style={{
          backgroundColor: color.hex,
          color: textColor,
          border: color.hex === '#FFFFFF' ? '1px solid #E8E8E8' : 'none',
        }}
      >
        {color.hex}
      </div>
      <span className="text-[10px] font-mono text-gray-400">
        {color.name}
      </span>
      <span className="text-[9px] font-mono text-gray-300">
        {color.variable.replace('--design-', '')}
      </span>
    </div>
  );
};

/**
 * Row of color swatches for one palette group
 */
const ColorRow: React.FC<{ group: ColorGroup }> = ({ group }) => (
  <div className="flex flex-wrap gap-3">
    {group.colors.map((color) => (
      <ColorSwatch
        key={color.variable}
        color={color}
        isPrimary={group.highlighted}
      />
    ))}
  </div>
);

/**
 * Gradient bar visualization
 */
const GradientBar: React.FC<{ gradient: GradientDef; large?: boolean }> = ({
  gradient,
  large,
}) => (
  <div className="flex flex-col gap-2">
    <div
      className={`w-full rounded-xl shadow-md ${large ? 'h-24' : 'h-12'}`}
      style={{
        background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
      }}
    />
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">
        {gradient.name}
      </span>
      <span className="text-xs font-mono text-gray-400">
        {gradient.variable}
      </span>
    </div>
    <div className="flex gap-4 text-xs font-mono text-gray-400">
      <span>
        from: <span style={{ color: gradient.from }}>&#9632;</span>{' '}
        {gradient.from}
      </span>
      <span>
        to: <span style={{ color: gradient.to }}>&#9632;</span> {gradient.to}
      </span>
    </div>
  </div>
);

/**
 * Glow box visualization
 */
const GlowBox: React.FC<{ glow: GlowDef }> = ({ glow }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="flex h-32 w-32 items-center justify-center rounded-2xl"
      style={{
        backgroundColor: glow.boxBg,
        boxShadow: `0 0 24px 4px ${glow.color}30, 0 0 48px 8px ${glow.color}15`,
      }}
    >
      <div
        className="h-16 w-16 rounded-xl"
        style={{ backgroundColor: glow.color }}
      />
    </div>
    <div className="text-center">
      <div className="text-sm font-medium text-gray-700">{glow.name}</div>
      <div className="text-xs font-mono text-gray-400">{glow.variable}</div>
    </div>
  </div>
);

/* ──────────────────────────── Main Component ──────────────────────────── */

/**
 * ColorPalette — 라이트 모드 + 블루 그라데이션 컨셉
 *
 * - 배경: #F0F4F8
 * - 카드 기반 레이아웃, 부드러운 그림자
 * - 블루 계열 헤딩 + gradient-text 효과
 * - 그라데이션 / 글로우 시각화
 */
export const ColorPalette: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-[#F0F4F8]"
    >
      <div className="mx-auto max-w-5xl space-y-8 p-8">
        {/* Header */}
        <header className="mb-8">
          <GradientHeading>Color Palette</GradientHeading>
          <p className="mt-2 text-sm text-gray-500">
            라이트 모드 디자인 시스템 — 블루 그라데이션 컨셉
          </p>
        </header>

        {/* ── Primary Palette ── */}
        <Card>
          <SectionHeading>Primary Palette</SectionHeading>
          <ColorRow group={blueGroup} />
        </Card>

        {/* ── Neutral Palette ── */}
        <Card>
          <SectionHeading>Neutral (Gray)</SectionHeading>
          <ColorRow group={neutralGroup} />
        </Card>

        {/* ── Accent Colors ── */}
        <Card>
          <SectionHeading>Accent Colors</SectionHeading>
          <div className="space-y-6">
            {accentGroups.map((group) => (
              <div key={group.label}>
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  {group.label}
                </h4>
                <ColorRow group={group} />
              </div>
            ))}
          </div>
        </Card>

        {/* ── Gradients ── */}
        <Card>
          <SectionHeading>Gradients</SectionHeading>
          <div className="space-y-6">
            <GradientBar gradient={gradients[0]} large />
            {gradients.slice(1).map((g) => (
              <GradientBar key={g.variable} gradient={g} />
            ))}
          </div>
        </Card>

        {/* ── Glows ── */}
        <Card>
          <SectionHeading>Glow Effects</SectionHeading>
          <div className="flex flex-wrap justify-center gap-8">
            {glows.map((glow) => (
              <GlowBox key={glow.variable} glow={glow} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
