import type { PortableTextBlock } from '@portabletext/types';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
};

export type AboutPageViewProps =
  | { status: 'error' }
  | { status: 'no-content' }
  | {
      status: 'ok';
      portraitUrl: string;
      portraitAlt: string;
      whoWeAreTitle: string;
      whoWeAreBody: PortableTextBlock[] | null;
      whatWeMakeTitle: string;
      whatWeMakeBody: PortableTextBlock[] | null;
    };

export function AboutPageView(props: AboutPageViewProps) {
  if (props.status === 'error') {
    return (
      <div className="container mx-auto px-4">
        <p className="hd-body-text">Error Connecting to Content Backend</p>
      </div>
    );
  }

  if (props.status === 'no-content') {
    return (
      <div className="container mx-auto px-4">
        <p className="hd-body-text">No Content</p>
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
                  <feFuncR
                    type="discrete"
                    tableValues="0 0.2 0.4 0.6 0.8 1"
                  />
                  <feFuncG
                    type="discrete"
                    tableValues="0 0.2 0.4 0.6 0.8 1"
                  />
                  <feFuncB
                    type="discrete"
                    tableValues="0 0.2 0.4 0.6 0.8 1"
                  />
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
        <div className="hd-body-text-bold text-shadow-lg">
          <p className="mb-4">
            <strong className="hd-section-header">{whoWeAreTitle}</strong>
          </p>
          {whoWeAreBody?.length ? (
            <PortableText value={whoWeAreBody} components={bodyComponents} />
          ) : null}
        </div>
        <div className="hd-body-text-bold text-shadow-lg">
          <p className="mb-4">
            <strong className="hd-section-header">{whatWeMakeTitle}</strong>
          </p>
          {whatWeMakeBody?.length ? (
            <PortableText value={whatWeMakeBody} components={bodyComponents} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
