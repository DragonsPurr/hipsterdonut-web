import { externalLinkAttributes } from "@/app/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hd-footer-bar">
      <div className="text-center font-body text-base md:text-lg text-black px-4">
        Site design by{' '}
        <a href="https://boxingoctop.us" className="hd-footer-link" {...externalLinkAttributes}>
          Boxing Octopus Creative
        </a>{' '}
        | All content and assets are <strong>Copyright © {year}{' '}
        <a href="https://dragonspurr.ca" className="hd-footer-link" {...externalLinkAttributes}>
          Dragon&apos;s Purr Crafts and Sundry Ltd.
        </a></strong>
      </div>
    </footer>
  );
}
