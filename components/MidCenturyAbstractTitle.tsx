import type { ReactNode } from 'react';

const BRAND_COLORS = [
  { fill: 'var(--hd-dark-blue)', hex: '#64aecc' },
  { fill: 'var(--hd-light-blue)', hex: '#74d3fd' },
  { fill: 'var(--hd-alt-green)', hex: '#84c8bd' },
  { fill: 'var(--hd-donut-pink)', hex: '#ef548f' },
  { fill: 'var(--hd-light-brown)', hex: '#f3a973' },
] as const;

/** Nav bar uses alt-green; link hover uses donut-pink — omit both so shapes stay visible. */
const NAV_BRAND_COLORS = [
  { fill: 'var(--hd-dark-blue)', hex: '#64aecc' },
  { fill: 'var(--hd-light-blue)', hex: '#74d3fd' },
  { fill: 'var(--hd-light-brown)', hex: '#f3a973' },
] as const;

/** Contact shape links — omit both blues so shapes stay distinct from section backgrounds. */
const LINK_BRAND_COLORS = [
  { fill: 'var(--hd-alt-green)', hex: '#84c8bd' },
  { fill: 'var(--hd-donut-pink)', hex: '#ef548f' },
  { fill: 'var(--hd-light-brown)', hex: '#f3a973' },
] as const;

const DONUT_PINK = { fill: 'var(--hd-donut-pink)', hex: '#ef548f' } as const;

type ShapeColorContext = 'default' | 'nav' | 'link';

const SHAPE_TYPES = ['disc', 'boomerang', 'rectangle', 'starburst', 'ellipse'] as const;

type ShapeType = (typeof SHAPE_TYPES)[number];

const SHAPE_CENTER = 50;

type CircleShape = { kind: 'circle'; r: number };
type PathShape = { kind: 'path'; d: string };
type EllipseShape = {
  kind: 'ellipse';
  rx: number;
  ry: number;
  rotation: number;
};
type RectShape = {
  kind: 'rect';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** Transform origin; defaults to the rectangle center */
  pivotCx?: number;
  pivotCy?: number;
  rx: number;
  rotation: number;
  skew: number;
};

type ShapeDefinition = CircleShape | PathShape | EllipseShape | RectShape;

type GeneratedShape = {
  shape: ShapeDefinition;
  fill: string;
  outlineStroke: string;
  overlayRotation: number;
  overlaySkew: number;
};

export type MidCenturyAbstractTitleProps = {
  /** Stable seed for reproducible shape layouts */
  seed: number | string;
  className?: string;
  /** Padding around the title; section headers use tighter inset */
  size?: 'page' | 'section' | 'link';
  /** Use `link` on contact shape links to omit blue fills */
  context?: ShapeColorContext;
  children: ReactNode;
};

const SHAPE_PADDING = {
  page: 'px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4',
  section: 'px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5',
  link: 'px-3 py-0.5 sm:px-4 sm:py-1',
  nav: 'px-2 py-0.5 md:px-3 md:py-1',
} as const;

export type MidCenturyAbstractShapeBackdropProps = {
  seed: number | string;
  className?: string;
  /** Use `nav` on items over the alt-green nav bar background */
  context?: ShapeColorContext;
};

export function MidCenturyAbstractShapeBackdrop({
  seed,
  className = '',
  context = 'default',
}: MidCenturyAbstractShapeBackdropProps) {
  const shadowFilterId = `mcm-shadow-${hashSeed(seed).toString(36)}`;
  const { shape, fill, outlineStroke, overlayRotation, overlaySkew } = generateShape(
    createRng(hashSeed(seed)),
    context,
  );
  const shadow = `url(#${shadowFilterId})`;
  const overlayTransform = shapeTransformAt(
    SHAPE_CENTER,
    SHAPE_CENTER,
    overlayRotation,
    overlaySkew,
  );

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`.trim()}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-hidden
    >
      <defs>
        <DropShadowFilter id={shadowFilterId} />
      </defs>
      {renderShapeElement(shape, { fill, filter: shadow })}
      <g transform={overlayTransform}>
        {renderShapeElement(shape, {
          fill: 'transparent',
          stroke: outlineStroke,
          strokeWidth: 1,
        })}
      </g>
    </svg>
  );
}

function brandColorsForContext(context: ShapeColorContext) {
  switch (context) {
    case 'nav':
      return NAV_BRAND_COLORS;
    case 'link':
      return LINK_BRAND_COLORS;
    default:
      return BRAND_COLORS;
  }
}

function generatePinkStarburst(rng: () => number): GeneratedShape {
  const shape: PathShape = {
    kind: 'path',
    d: starburstPath(
      SHAPE_CENTER,
      SHAPE_CENTER,
      8 + Math.floor(rng() * 3) * 2,
      range(rng, 46, 50),
      range(rng, 20, 26),
    ),
  };
  const { rotation: overlayRotation, skew: overlaySkew } = overlayAngles(rng, shape);

  return {
    shape,
    fill: DONUT_PINK.fill,
    outlineStroke: darkenHex(DONUT_PINK.hex, 0.2),
    overlayRotation,
    overlaySkew,
  };
}

export type MidCenturyPinkStarburstBackdropProps = {
  seed: number | string;
  className?: string;
};

/** Seeded pink starburst for decorative icon backdrops. */
export function MidCenturyPinkStarburstBackdrop({
  seed,
  className = '',
}: MidCenturyPinkStarburstBackdropProps) {
  const shadowFilterId = `mcm-starburst-${hashSeed(seed).toString(36)}`;
  const { shape, fill, outlineStroke, overlayRotation, overlaySkew } = generatePinkStarburst(
    createRng(hashSeed(seed)),
  );
  const shadow = `url(#${shadowFilterId})`;
  const overlayTransform = shapeTransformAt(
    SHAPE_CENTER,
    SHAPE_CENTER,
    overlayRotation,
    overlaySkew,
  );

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`.trim()}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-hidden
    >
      <defs>
        <DropShadowFilter id={shadowFilterId} />
      </defs>
      {renderShapeElement(shape, { fill, filter: shadow })}
      <g transform={overlayTransform}>
        {renderShapeElement(shape, {
          fill: 'transparent',
          stroke: outlineStroke,
          strokeWidth: 1,
        })}
      </g>
    </svg>
  );
}

function hashSeed(seed: number | string): number {
  const value = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRng(initial: number) {
  let state = initial;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function darkenHex(hex: string, amount: number): string {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const darkenChannel = (channel: number) =>
    Math.max(0, Math.round(channel * (1 - amount)));

  return `#${darkenChannel(red).toString(16).padStart(2, '0')}${darkenChannel(green)
    .toString(16)
    .padStart(2, '0')}${darkenChannel(blue).toString(16).padStart(2, '0')}`;
}

function signedRange(rng: () => number, min: number, max: number): number {
  const magnitude = range(rng, min, max);
  return rng() > 0.5 ? magnitude : -magnitude;
}

function sectionOverlayAngles(rng: () => number): { rotation: number; skew: number } {
  return {
    rotation: signedRange(rng, 6, 11),
    skew: signedRange(rng, 2, 5),
  };
}

function overlayAngles(
  rng: () => number,
  shape: ShapeDefinition,
): { rotation: number; skew: number } {
  if (shape.kind === 'rect') {
    return {
      rotation: signedRange(rng, 6, 12),
      skew: signedRange(rng, 2, 5),
    };
  }

  return {
    rotation: signedRange(rng, 8, 16),
    skew: signedRange(rng, 5, 12),
  };
}

const SECTION_VIEWBOX = 100;

function rectGeometry(shape: RectShape) {
  const x = shape.x ?? 0;
  const y = shape.y ?? 0;
  const width = shape.width ?? SECTION_VIEWBOX;
  const height = shape.height ?? SECTION_VIEWBOX;
  const cx = x + width / 2;
  const cy = y + height / 2;

  return {
    x,
    y,
    width,
    height,
    cx: shape.pivotCx ?? cx,
    cy: shape.pivotCy ?? cy,
  };
}

function transformPoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rotationDeg: number,
  skewDeg: number,
): { x: number; y: number } {
  let px = x - cx;
  let py = y - cy;
  const skewRad = (skewDeg * Math.PI) / 180;
  px += Math.tan(skewRad) * py;
  const rotRad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rotRad);
  const sin = Math.sin(rotRad);

  return {
    x: px * cos - py * sin + cx,
    y: px * sin + py * cos + cy,
  };
}

function sectionRectCorners(shape: RectShape) {
  const x = shape.x ?? 0;
  const y = shape.y ?? 0;
  const width = shape.width ?? SECTION_VIEWBOX;
  const height = shape.height ?? SECTION_VIEWBOX;

  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
}

function computeSectionShapeLayout(
  shape: RectShape,
  overlayRotation: number,
  overlaySkew: number,
  shadowDx = 2,
  shadowDy = 2,
) {
  const { cx, cy } = rectGeometry(shape);
  const corners = sectionRectCorners(shape);
  const transformedPoints = [
    ...corners.map((corner) =>
      transformPoint(corner.x, corner.y, cx, cy, shape.rotation, shape.skew),
    ),
    ...corners.map((corner) => {
      const afterBase = transformPoint(corner.x, corner.y, cx, cy, shape.rotation, shape.skew);
      return transformPoint(afterBase.x, afterBase.y, cx, cy, overlayRotation, overlaySkew);
    }),
  ];

  const minX = Math.min(...transformedPoints.map((point) => point.x)) - shadowDx;
  const maxX = Math.max(...transformedPoints.map((point) => point.x)) + shadowDx;
  const minY = Math.min(...transformedPoints.map((point) => point.y)) - shadowDy;
  const maxY = Math.max(...transformedPoints.map((point) => point.y)) + shadowDy + shadowDy;

  return {
    viewBox: {
      x: Math.min(0, minX),
      y: Math.min(0, minY),
      width: Math.max(SECTION_VIEWBOX, maxX) - Math.min(0, minX),
      height: Math.max(SECTION_VIEWBOX, maxY) - Math.min(0, minY),
    },
    bleed: {
      top: Math.max(0, -minY),
      right: Math.max(0, maxX - SECTION_VIEWBOX),
      bottom: Math.max(0, maxY - SECTION_VIEWBOX),
      left: Math.max(0, -minX),
    },
  };
}

function shapeTransformAt(cx: number, cy: number, rotation: number, skew = 0): string {
  if (skew === 0) {
    return `rotate(${rotation} ${cx} ${cy})`;
  }

  return `translate(${cx} ${cy}) rotate(${rotation}) skewX(${skew}) translate(${-cx} ${-cy})`;
}

function boomerangPath(
  cx: number,
  cy: number,
  scale: number,
  rotation: number,
): string {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const rotate = (x: number, y: number) => ({
    x: cx + (x * cos - y * sin) * scale,
    y: cy + (x * sin + y * cos) * scale,
  });

  const points = [
    rotate(-90, -18),
    rotate(-35, -42),
    rotate(35, -42),
    rotate(90, -18),
    rotate(55, 18),
    rotate(0, 42),
    rotate(-55, 18),
  ];

  return `M ${points[0]!.x} ${points[0]!.y} Q ${points[1]!.x} ${points[1]!.y} ${points[2]!.x} ${points[2]!.y} Q ${points[3]!.x} ${points[3]!.y} ${points[4]!.x} ${points[4]!.y} Q ${points[5]!.x} ${points[5]!.y} ${points[6]!.x} ${points[6]!.y} Z`;
}

function starburstPath(cx: number, cy: number, spokes: number, outer: number, inner: number): string {
  const segments: string[] = [];

  for (let index = 0; index < spokes * 2; index += 1) {
    const angle = (Math.PI * index) / spokes - Math.PI / 2;
    const radius = index % 2 === 0 ? outer : inner;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    segments.push(`${index === 0 ? 'M' : 'L'} ${x} ${y}`);
  }

  return `${segments.join(' ')} Z`;
}

function renderShapeElement(
  shape: ShapeDefinition,
  {
    fill,
    stroke,
    strokeWidth,
    filter,
  }: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    filter?: string;
  },
): ReactNode {
  switch (shape.kind) {
    case 'circle':
      return (
        <circle
          cx={SHAPE_CENTER}
          cy={SHAPE_CENTER}
          r={shape.r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          filter={filter}
        />
      );
    case 'path':
      return (
        <path
          d={shape.d}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          filter={filter}
        />
      );
    case 'ellipse':
      return (
        <ellipse
          cx={SHAPE_CENTER}
          cy={SHAPE_CENTER}
          rx={shape.rx}
          ry={shape.ry}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          transform={`rotate(${shape.rotation} ${SHAPE_CENTER} ${SHAPE_CENTER})`}
          filter={filter}
        />
      );
    case 'rect': {
      const { x, y, width, height, cx, cy } = rectGeometry(shape);

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={shape.rx}
          ry={shape.rx}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          transform={shapeTransformAt(cx, cy, shape.rotation, shape.skew)}
          filter={filter}
        />
      );
    }
  }
}

function generateShape(rng: () => number, context: ShapeColorContext = 'default'): GeneratedShape {
  const brandColor = pick(rng, brandColorsForContext(context));
  const fill = brandColor.fill;
  const outlineStroke = darkenHex(brandColor.hex, 0.2);
  const shapeType = pick(rng, SHAPE_TYPES);
  let shape: ShapeDefinition;

  switch (shapeType as ShapeType) {
    case 'disc':
      shape = {
        kind: 'circle',
        r: range(rng, 42, 48),
      };
      break;
    case 'boomerang':
      shape = {
        kind: 'path',
        d: boomerangPath(
          SHAPE_CENTER,
          SHAPE_CENTER,
          range(rng, 0.48, 0.58),
          range(rng, 0, Math.PI * 2),
        ),
      };
      break;
    case 'rectangle':
      shape = {
        kind: 'rect',
        rx: range(rng, 8, 12),
        rotation: range(rng, -8, 8),
        skew: signedRange(rng, 3, 6),
      };
      break;
    case 'starburst':
      shape = {
        kind: 'path',
        d: starburstPath(
          SHAPE_CENTER,
          SHAPE_CENTER,
          8 + Math.floor(rng() * 3) * 2,
          range(rng, 42, 48),
          range(rng, 16, 22),
        ),
      };
      break;
    case 'ellipse':
      shape = {
        kind: 'ellipse',
        rx: range(rng, 44, 48),
        ry: range(rng, 38, 44),
        rotation: range(rng, -35, 35),
      };
      break;
  }

  const { rotation: overlayRotation, skew: overlaySkew } = overlayAngles(rng, shape);

  return {
    shape,
    fill,
    outlineStroke,
    overlayRotation,
    overlaySkew,
  };
}

const SECTION_BACKGROUND_OPACITY_CLASS = 'opacity-80';

type GeneratedSectionShape = {
  shape: RectShape;
  fill: string;
  outlineStroke: string;
  overlayRotation: number;
  overlaySkew: number;
};

function generateSectionRectangle(rng: () => number): GeneratedSectionShape {
  const brandColor = pick(rng, BRAND_COLORS);
  const shape: RectShape = {
    kind: 'rect',
    x: 0,
    y: 0,
    width: SECTION_VIEWBOX,
    height: SECTION_VIEWBOX,
    pivotCy: range(rng, 50, 56),
    rx: range(rng, 12, 20),
    rotation: range(rng, -10, 10),
    skew: signedRange(rng, 4, 8),
  };
  const { rotation: overlayRotation, skew: overlaySkew } = sectionOverlayAngles(rng);

  return {
    shape,
    fill: brandColor.fill,
    outlineStroke: darkenHex(brandColor.hex, 0.2),
    overlayRotation,
    overlaySkew,
  };
}

export type SectionBackgroundModel = GeneratedSectionShape & {
  layout: ReturnType<typeof computeSectionShapeLayout>;
  pivot: { cx: number; cy: number };
  overlayTransform: string;
  shadowFilterId: string;
};

export function createSectionBackgroundModel(seed: number | string): SectionBackgroundModel {
  const generated = generateSectionRectangle(createRng(hashSeed(seed)));
  const pivot = rectGeometry(generated.shape);

  return {
    ...generated,
    layout: computeSectionShapeLayout(
      generated.shape,
      generated.overlayRotation,
      generated.overlaySkew,
    ),
    pivot: { cx: pivot.cx, cy: pivot.cy },
    overlayTransform: shapeTransformAt(
      pivot.cx,
      pivot.cy,
      generated.overlayRotation,
      generated.overlaySkew,
    ),
    shadowFilterId: `mcm-section-shadow-${hashSeed(seed).toString(36)}`,
  };
}

export { SECTION_BACKGROUND_OPACITY_CLASS };

export function renderSectionBackgroundRect(
  shape: RectShape,
  {
    fill,
    stroke,
    strokeWidth,
    filter,
    cx,
    cy,
  }: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    filter?: string;
    cx: number;
    cy: number;
  },
) {
  const { x, y, width, height } = rectGeometry(shape);

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={shape.rx}
      ry={shape.rx}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      transform={shapeTransformAt(cx, cy, shape.rotation, shape.skew)}
      filter={filter}
    />
  );
}

export function SectionBackgroundDropShadowFilter({
  id,
  dx = 2,
  dy = 2,
  spread = 0,
}: {
  id: string;
  dx?: number;
  dy?: number;
  spread?: number;
}) {
  const bleed = Math.max(dx, dy) + spread + 2;

  return (
    <filter
      id={id}
      x={`-${bleed}%`}
      y={`-${bleed}%`}
      width={`${100 + bleed * 2}%`}
      height={`${100 + bleed * 2}%`}
      colorInterpolationFilters="sRGB"
    >
      <feDropShadow dx={dx} dy={dy} stdDeviation="0" floodColor="#000000" floodOpacity="1" />
    </filter>
  );
}

function DropShadowFilter({
  id,
  dx = 4,
  dy = 4,
  spread = 0,
}: {
  id: string;
  dx?: number;
  dy?: number;
  spread?: number;
}) {
  const bleed = Math.max(dx, dy) + spread + 2;

  return (
    <filter
      id={id}
      x={`-${bleed}%`}
      y={`-${bleed}%`}
      width={`${100 + bleed * 2}%`}
      height={`${100 + bleed * 2}%`}
      colorInterpolationFilters="sRGB"
    >
      <feDropShadow dx={dx} dy={dy} stdDeviation="0" floodColor="#000000" floodOpacity="1" />
    </filter>
  );
}

export function MidCenturyAbstractTitle({
  seed,
  className = '',
  size = 'page',
  context = 'default',
  children,
}: MidCenturyAbstractTitleProps) {
  const paddingClass = SHAPE_PADDING[size];

  return (
    <div
      className={`relative inline-flex max-w-full items-center justify-center overflow-visible ${paddingClass} ${className}`.trim()}
    >
      <MidCenturyAbstractShapeBackdrop seed={seed} context={context} />
      <div className="relative">{children}</div>
    </div>
  );
}
