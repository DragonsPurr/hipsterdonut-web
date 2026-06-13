import { MidCenturyAbstractTitle } from '@/components/MidCenturyAbstractTitle';
import type { ReactNode } from 'react';

export type SectionTitleProps = {
  text: string;
  seed: string;
  className?: string;
  id?: string;
  /** Use `h2` for labelled sections; defaults to `strong` for inline emphasis */
  as?: 'strong' | 'h2';
};

/** Wraps an existing hd-section-header with a seeded mid-century shape behind it. */
export function SectionTitle({
  text,
  seed,
  className,
  id,
  as = 'strong',
}: SectionTitleProps) {
  const headingClassName = 'hd-section-header !mb-0';
  let heading: ReactNode;

  if (as === 'h2') {
    heading = (
      <h2 id={id} className={headingClassName}>
        {text}
      </h2>
    );
  } else {
    heading = <strong className={headingClassName}>{text}</strong>;
  }

  return (
    <MidCenturyAbstractTitle
      seed={seed}
      size="section"
      className={`relative z-10 ${className ?? ''}`.trim()}
    >
      {heading}
    </MidCenturyAbstractTitle>
  );
}
