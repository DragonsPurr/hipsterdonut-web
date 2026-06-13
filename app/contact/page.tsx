import { contactLinks } from '@/app/lib/contact-links';
import { siteInfo } from '@/app/lib/constants';
import { BoxIcon } from '@/components/icons/BoxIcon';
import { boxiconsContactEmail, boxiconsContactPhone } from '@/components/icons/boxicons-contact';
import { MidCenturySectionBackground } from '@/components/MidCenturySectionBackground';
import { PageTitle } from '@/components/PageTitle';
import { SectionTitle } from '@/components/SectionTitle';
import { ShapeIcon } from '@/components/ShapeIcon';
import { ShapeLink } from '@/components/ShapeLink';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Contact | ${siteInfo.name}`,
  description: `Get in touch with ${siteInfo.name}.`,
};

export default function Contact() {
  return (
    <div className="container mx-auto max-w-4xl">
      <PageTitle text="Get in touch" seed="contact" />
      <p className="hd-body-text-bold mb-8 md:mb-10">
        Want to reach us? We&apos;d love to hear from you. Here&apos;s how you can get in touch.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section aria-labelledby="contact-phone-heading" className="relative isolate flex flex-col">
          <div className="flex justify-center">
            <SectionTitle
              text="Talk to us"
              seed="contact-phone"
              id="contact-phone-heading"
              as="h2"
            />
          </div>
          <MidCenturySectionBackground seed="contact-phone-body" className="flex-1">
            <div className="space-y-4">
              <div className="flex justify-center">
                <ShapeIcon icon={boxiconsContactPhone} seed="contact-phone-icon" />
              </div>
              <p className="hd-body-text-bold text-lg md:text-xl">
                Questions about our apparel, sizing, or an existing order? Give us a call during
                business hours.
              </p>
              <p className="text-center">
                <a
                  href={contactLinks.phone}
                  className="font-title text-xl text-(--hd-title-yellow) no-underline hover:text-(--hd-light-blue) md:text-2xl [text-shadow:2px_2px_0_rgb(0_0_0)]"
                >
                  {siteInfo.phone}
                </a>
              </p>
              <p className="hd-body-text-bold text-center text-base text-(--hd-gray-600)">
                {siteInfo.hours}
              </p>
            </div>
          </MidCenturySectionBackground>
        </section>

        <section
          aria-labelledby="contact-email-heading"
          className="relative isolate flex flex-col"
        >
          <div className="flex justify-center">
            <SectionTitle
              text="Contact support"
              seed="contact-email"
              id="contact-email-heading"
              as="h2"
            />
          </div>
          <MidCenturySectionBackground seed="contact-email-body" className="flex-1">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center">
                <ShapeIcon icon={boxiconsContactEmail} seed="contact-email-icon" />
              </div>
              <p className="hd-body-text-bold flex-1 text-lg md:text-xl">
                Need help with an order, shipping, or wholesale inquiries? Send us a message and
                we&apos;ll get back to you as soon as we can.
              </p>
              <div className="flex flex-col items-center gap-4">
                <ShapeLink
                  href={contactLinks.productSupport}
                  text="Product Support"
                  seed="contact-product-support"
                />
                <ShapeLink
                  href={contactLinks.generalInquiry}
                  text="General Inquiries"
                  seed="contact-general-inquiry"
                />
                <ShapeLink
                  href={contactLinks.billingInquiry}
                  text="Billing Inquiries"
                  seed="contact-billing-inquiry"
                />
              </div>
            </div>
          </MidCenturySectionBackground>
        </section>
      </div>
    </div>
  );
}
