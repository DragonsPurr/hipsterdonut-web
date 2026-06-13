'use client';

import {
  createSectionBackgroundModel,
  renderSectionBackgroundRect,
  SectionBackgroundDropShadowFilter,
  SECTION_BACKGROUND_OPACITY_CLASS,
  type SectionBackgroundModel,
} from '@/components/MidCenturyAbstractTitle';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const SECTION_VIEWBOX = 100;

const DEFAULT_CONTENT_CLASS =
  'relative z-10 px-6 pt-4 pb-8 md:px-10 md:pt-5 md:pb-10';

export type MidCenturySectionBackgroundProps = {
  /** Stable seed for reproducible rectangle colour and transform */
  seed: number | string;
  className?: string;
  /** Override inner padding — use tighter values for compact panels like nav dropdowns */
  contentClassName?: string;
  /** Section body content only — place headers outside with SectionTitle */
  children: ReactNode;
};

type BleedPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

function bleedPaddingForContent(
  layout: SectionBackgroundModel['layout'],
  contentWidth: number,
  contentHeight: number,
): BleedPadding {
  return {
    top: (layout.bleed.top / SECTION_VIEWBOX) * contentHeight,
    right: (layout.bleed.right / SECTION_VIEWBOX) * contentWidth,
    bottom: (layout.bleed.bottom / SECTION_VIEWBOX) * contentHeight,
    left: (layout.bleed.left / SECTION_VIEWBOX) * contentWidth,
  };
}

/** Body backdrop with extra space sized to the transformed shape bounds. */
export function MidCenturySectionBackground({
  seed,
  className = '',
  contentClassName = DEFAULT_CONTENT_CLASS,
  children,
}: MidCenturySectionBackgroundProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const model = useMemo(() => createSectionBackgroundModel(seed), [seed]);
  const [bleedPadding, setBleedPadding] = useState<BleedPadding>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const measure = () => {
      setBleedPadding(
        bleedPaddingForContent(model.layout, content.offsetWidth, content.offsetHeight),
      );
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(content);

    return () => observer.disconnect();
  }, [model.layout]);

  const { viewBox } = model.layout;
  const { cx, cy } = model.pivot;

  return (
    <div className={`relative z-0 mt-1 w-full ${className}`.trim()}>
      <div
        className="relative"
        style={{
          paddingLeft: bleedPadding.left,
          paddingRight: bleedPadding.right,
        }}
      >
        <svg
          className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible ${SECTION_BACKGROUND_OPACITY_CLASS}`}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          preserveAspectRatio="none"
          role="img"
          aria-hidden
        >
          <defs>
            <SectionBackgroundDropShadowFilter id={model.shadowFilterId} />
          </defs>
          {renderSectionBackgroundRect(model.shape, {
            fill: model.fill,
            filter: `url(#${model.shadowFilterId})`,
            cx,
            cy,
          })}
          <g transform={model.overlayTransform}>
            {renderSectionBackgroundRect(model.shape, {
              fill: 'transparent',
              stroke: model.outlineStroke,
              strokeWidth: 0.5,
              cx,
              cy,
            })}
          </g>
        </svg>
        {bleedPadding.top > 0 ? (
          <div aria-hidden className="pointer-events-none" style={{ height: bleedPadding.top }} />
        ) : null}
        <div ref={contentRef} className={contentClassName}>
          {children}
        </div>
        {bleedPadding.bottom > 0 ? (
          <div aria-hidden className="pointer-events-none" style={{ height: bleedPadding.bottom }} />
        ) : null}
      </div>
    </div>
  );
}
