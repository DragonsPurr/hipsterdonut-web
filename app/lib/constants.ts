const envConfig = {
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    userId: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
  },
  umamiAnalyticsId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
};

const asset_base_url = "https://dp-hd-assets.tor1.digitaloceanspaces.com";
const alt_base_url = "https://dp-assets.tor1.digitaloceanspaces.com";

const externalLinkAttributes = { target: "_blank", rel: "noreferrer" as const };

const siteInfo = {
  name: "Hipster Donut Apparel",
  url: "https://hipsterdonut.ca",
  email: "info@hipsterdonut.ca",
  phone: "+1 (416) 555-1234",
  address: "608-26 Carluke Crescent, Toronto, ON M2L 2J2",
  hours: "Monday - Friday: 9:00 AM - 5:00 PM",
  description: "Hipster Donut Apparel is a Dragon's Purr Brand that specializes in apparel featuring dopey-as-hell pop-culture mashups, culturejamming, and overall sardonic, eye-rolling humour befitting its obvious elder millennial audience.",
};

const socialMedia = {
  bluesky: "https://bsky.app/profile/dragonspurr.bsky.social",
  heycafe: "https://hey.cafe/@dragonspurr",
  eh: "https://ehnw.ca/u/dragonspurr",
  instagram: "https://www.instagram.com/dragonspurr",
  facebook: "https://www.facebook.com/dragonspurr",
};

const logoTypes = {
  wide_orig_colour: `${asset_base_url}/brand/hipsterdonut_wide-orig-colour.png`,
  wide_alt_colour: `${asset_base_url}/brand/hipsterdonut_wide-alt-colour.png`,
  square_orig_colour: `${asset_base_url}/brand/hipsterdonut_square-orig-colour.png`,
  square_alt_colour: `${asset_base_url}/brand/hipsterdonut_square-alt-colour.png`,
  favicon: `${asset_base_url}/brand/hipsterdonut_square-favicon.png`,
};

export { asset_base_url, alt_base_url, externalLinkAttributes, logoTypes, siteInfo, socialMedia, envConfig };
