import { buildSiteAssetUrl } from './site-assets';

const externalLinkAttributes = { target: '_blank', rel: 'noreferrer' as const };

const siteInfo = {
  name: "Hipster Donut Apparel",
  url: "https://hipsterdonut.ca",
  productSupportEmail: "productsupport@dragonspurr.ca",
  generalInquiryEmail: "info@dragonspurr.ca",
  billingInquiryEmail: "billing@dragonspurr.ca",
  phone: "+1 (289) 269-2529",
  address: "608-26 Carluke Crescent, Toronto, ON M2L 2J2",
  hours: "Monday - Friday: 9:00 AM - 5:00 PM",
  description: "Hipster Donut Apparel is a Dragon's Purr Brand that specializes in apparel featuring dopey-as-hell pop-culture mashups, culturejamming, and overall sardonic, eye-rolling humour befitting its obvious elder millennial audience.",
};

const logoTypes = {
  wide_orig_colour: buildSiteAssetUrl('brand/hipsterdonut_wide-orig-colour.png'),
  wide_alt_colour: buildSiteAssetUrl('brand/hipsterdonut_wide-alt-colour.png'),
  square_orig_colour: buildSiteAssetUrl('brand/hipsterdonut_square-orig-colour.png'),
  square_alt_colour: buildSiteAssetUrl('brand/hipsterdonut_square-alt-colour.png'),
  favicon: buildSiteAssetUrl('brand/hipsterdonut_square-favicon.png'),
};

const siteAssets = {
  donutBgTile: buildSiteAssetUrl('brand/donut-bkgd.png'),
};

export { externalLinkAttributes, logoTypes, siteAssets, siteInfo };
