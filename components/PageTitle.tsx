import { MidCenturyAbstractTitle } from '@/components/MidCenturyAbstractTitle';

export type PageTitleProps = {
  text: string;
  seed?: string;
  className?: string;
};

export function PageTitle({ text, seed, className = 'mb-8 md:mb-12' }: PageTitleProps) {
  return (
    <MidCenturyAbstractTitle seed={seed ?? text} size="page" className={className}>
      <h1 className="hd-page-header !mb-0">{text}</h1>
    </MidCenturyAbstractTitle>
  );
}
