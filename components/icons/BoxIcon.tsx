'use client';

import { Icon } from '@iconify/react';
import type { IconifyIcon } from '@iconify/types';

type BoxIconProps = {
  icon: IconifyIcon;
  className?: string;
  width?: number | string;
  height?: number | string;
};

/** Renders a bundled Boxicons glyph (https://icon-sets.iconify.design/boxicons/). */
export function BoxIcon({ icon, className, width = '1.25em', height = '1.25em' }: BoxIconProps) {
  return (
    <Icon
      icon={icon}
      className={className}
      width={width}
      height={height}
      aria-hidden
    />
  );
}
