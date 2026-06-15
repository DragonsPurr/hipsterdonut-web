import { MidCenturyAbstractTitle } from '@/components/MidCenturyAbstractTitle';

export type ShapeLinkProps = {
  href: string;
  text: string;
  seed: string;
  className?: string;
};

/** Compact anchor with a seeded mid-century shape behind the label. */
export function ShapeLink({ href, text, seed, className }: ShapeLinkProps) {
  return (
    <MidCenturyAbstractTitle seed={seed} size="link" context="link" className={className}>
      <a
        href={href}
        className="font-title text-xl text-(--hd-title-yellow) no-underline hover:text-(--hd-donut-pink) md:text-2xl [text-shadow:1px_1px_0_rgb(0_0_0)]"
      >
        {text}
      </a>
    </MidCenturyAbstractTitle>
  );
}
