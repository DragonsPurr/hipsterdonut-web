import { MidCenturyPinkStarburstBackdrop } from '@/components/MidCenturyAbstractTitle';
import { BoxIcon } from '@/components/icons/BoxIcon';
import type { IconifyIcon } from '@iconify/types';

type ShapeIconProps = {
  icon: IconifyIcon;
  seed: string;
  width?: number | string;
  height?: number | string;
};

/** Contact-style icon with a seeded pink starburst behind it. */
export function ShapeIcon({ icon, seed, width = '4rem', height = '4rem' }: ShapeIconProps) {
  return (
    <div className="relative inline-flex h-28 w-28 items-center justify-center">
      <MidCenturyPinkStarburstBackdrop seed={seed} />
      <BoxIcon
        icon={icon}
        width={width}
        height={height}
        className="relative drop-shadow-[2px_2px_0_rgb(0_0_0)]"
      />
    </div>
  );
}
