import type { IconifyIcon } from '@iconify/types';

const size = { width: 24, height: 24 } as const;

export const boxiconsCart: IconifyIcon = {
  ...size,
  body: '<path fill="currentColor" d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8a1 1 0 0 0 .96-.726l3-10a1 1 0 0 0-.138-.843M17.307 15h-6.64l-2.4-6h11.053z"/><circle cx="10.5" cy="19.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="19.5" r="1.5" fill="currentColor"/>',
};

export const boxiconsCartFilled: IconifyIcon = {
  ...size,
  body: '<path fill="currentColor" d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8a1 1 0 0 0 .96-.726l3-10a1 1 0 0 0-.138-.843M10.5 19.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m9 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"/>',
};

export const boxiconsUserCircle: IconifyIcon = {
  ...size,
  body: '<path fill="currentColor" d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10s10-4.579 10-10S17.421 2 12 2m0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3s-3-1.272-3-3s1.273-3 3-3m-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2s3.209.88 4.106 2.2C14.772 18.852 13.491 19.5 12 19.5s-2.772-.648-5.106-2.228"/>',
};

export const boxiconsUserCircleFilled: IconifyIcon = {
  ...size,
  body: '<path fill="currentColor" d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10s10-4.579 10-10S17.421 2 12 2m0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3s-3-1.272-3-3s1.273-3 3-3m-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2s3.209.88 4.106 2.2C14.772 18.852 13.491 19.5 12 19.5s-2.772-.648-5.106-2.228"/>',
};
