import type { PortableTextBlock } from '@portabletext/types';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { MidCenturySectionBackground } from '@/components/MidCenturySectionBackground';
import { SectionTitle } from '@/components/SectionTitle';

const aboutPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-(--hd-donut-pink) font-bold">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
  },
};

export type AboutPageViewProps =
  | { status: 'unconfigured' }
  | { status: 'no-content' }
  | { status: 'error' }
  | {
      status: 'ok';
      portraitUrl: string;
      portraitAlt: string;
      whoWeAreTitle: string;
      whoWeAreBody: PortableTextBlock[] | null;
      whatWeMakeTitle: string;
      whatWeMakeBody: PortableTextBlock[] | null;
    };

function AboutSection({
  heading,
  content,
  seed,
}: {
  heading: string;
  content: PortableTextBlock[] | null;
  seed: string;
}) {
  return (
    <div className="hd-body-text-bold text-shadow-lg relative isolate">
      <SectionTitle text={heading} seed={seed} />
      {content?.length ? (
        <MidCenturySectionBackground seed={`${seed}-body`}>
          <div className="[&_p+p]:mt-4">
            <PortableText value={content} components={aboutPortableTextComponents} />
          </div>
        </MidCenturySectionBackground>
      ) : null}
    </div>
  );
}

export function AboutPageView(props: AboutPageViewProps) {
  if (props.status === 'unconfigured') {
    return (
      <div className="container mx-auto px-4">
        <p className="hd-body-text mb-6">
          Add <code className="text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{' '}
          <code className="text-sm">NEXT_PUBLIC_SANITY_DATASET</code> to start loading the About
          page from Sanity.
        </p>
      </div>
    );
  }

  if (props.status === 'no-content') {
    return (
      <div className="container mx-auto px-4">
        <p className="hd-body-text">
          No About page content yet. Add the About Page document in <code className="text-sm">/studio</code>.
        </p>
      </div>
    );
  }

  if (props.status === 'error') {
    return (
      <div className="container mx-auto px-4">
        <p className="hd-body-text">Could not load About page content. Try again later.</p>
      </div>
    );
  }

  const {
    portraitUrl,
    portraitAlt,
    whoWeAreTitle,
    whoWeAreBody,
    whatWeMakeTitle,
    whatWeMakeBody,
  } = props;

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start py-18">
        <div className="flex justify-start items-start">
          <svg
            width={0}
            height={0}
            className="pointer-events-none absolute overflow-hidden"
            aria-hidden
          >
            <defs>
              <filter
                id="hd-about-posterize"
                colorInterpolationFilters="sRGB"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
              >
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
                  <feFuncG type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
                  <feFuncB type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
          <div className="hd-about-portrait-shadow">
            <div className="hd-about-portrait-wrap">
              <Image
                src={portraitUrl}
                alt={portraitAlt}
                fill
                className="hd-circular-image"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
        <AboutSection heading={whoWeAreTitle} content={whoWeAreBody} seed="about-who-we-are" />
        <AboutSection heading={whatWeMakeTitle} content={whatWeMakeBody} seed="about-what-we-make" />
      </div>
    </div>
  );
}
