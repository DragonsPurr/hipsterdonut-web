import { AboutPageView } from '@/components/AboutPageView';
import { asset_base_url } from '@/app/lib/constants';
import { getAboutPageContent, resolvePortraitAlt } from '@/app/lib/about';
import { isSanityConfigured, urlFor } from '@/app/lib/sanity';

export default async function About() {
  if (!isSanityConfigured()) {
    return <AboutPageView status="error" />;
  }

  let content;
  try {
    content = await getAboutPageContent();
  } catch {
    return <AboutPageView status="error" />;
  }

  if (content === null) {
    return <AboutPageView status="no-content" />;
  }

  const portraitUrl =
    content.portraitImage != null
      ? urlFor(content.portraitImage).width(1000).height(1000).fit('crop').auto('format').url()
      : `${asset_base_url}/kayt-and-ryan.png`;
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
