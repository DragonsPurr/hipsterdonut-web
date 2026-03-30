import { externalLinkAttributes, logoTypes } from "@/app/lib/constants";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 w-full py-18 items-center">
      <div className="flex items-center justify-center md:justify-start w-3/4 px-2 md:pl-12">
        <Image
          src={logoTypes.square_orig_colour}
          alt="Hipster Donut Apparel logo"
          className="home-page-logo"
          width={400}
          height={400}
        />
      </div>
      <div className="flex justify-center md:justify-end items-center font-body-bold text-shadow-lg text-3xl sm:text-4xl md:text-[40px] leading-tight md:leading-none px-2 md:px-0 text-center md:text-left">
        <p>
          Ahhhhh!!! It&apos;s <strong className="hd-section-header">Hipster Donut Apparel</strong> !!!!
          <br /><br />
          A <strong><a href="https://dragonspurr.ca" className="hd-link text-red-800" {...externalLinkAttributes}>Dragon&apos;s Purr Crafts and Sundry</a></strong> brand that specializes in apparel featuring dopey-as-hell pop-culture mashups, culturejamming, and overall sardonic, eye-rolling humour befitting its obvious elder millennial audience.
        </p>
      </div>
    </div>
  );
}
