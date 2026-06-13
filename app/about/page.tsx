import { AboutPageView } from '@/components/AboutPageView';
import { getAboutPageContent, resolvePortraitAlt } from '@/app/lib/about';
import { siteInfo } from '@/app/lib/constants';
import { isSanityConfigured, urlFor } from '@/app/lib/sanity';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `About | ${siteInfo.name}`,
  description: `Learn about ${siteInfo.name}.`,
};

export default async function About() {
  if (!isSanityConfigured()) {
    return <AboutPageView status="unconfigured" />;
  }

  let content;
  try {
    content = await getAboutPageContent();
  } catch {
    return <AboutPageView status="error" />;
  }

  if (content === null || content.portraitImage == null) {
    return <AboutPageView status="no-content" />;
  }

  const portraitUrl = urlFor(content.portraitImage)
    .width(1000)
    .height(1000)
    .fit('crop')
    .auto('format')
    .url();
  const portraitAlt = resolvePortraitAlt(content);

  return (
    <AboutPageView
      status="ok"
      portraitUrl={portraitUrl}
      portraitAlt={portraitAlt}
      whoWeAreTitle={content.whoWeAreTitle?.trim() || 'Who We Are'}
      whoWeAreBody={content.whoWeAreBody?.length ? content.whoWeAreBody : null}
      whatWeMakeTitle={content.whatWeMakeTitle?.trim() || 'What We Make'}
      whatWeMakeBody={content.whatWeMakeBody?.length ? content.whatWeMakeBody : null}
    />
  );
}
