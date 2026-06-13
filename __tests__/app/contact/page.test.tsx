import { contactLinks } from '@/app/lib/contact-links';
import { siteInfo } from '@/app/lib/constants';
import { render, screen } from '@testing-library/react';
import Contact from '@/app/contact/page';

describe('Contact page', () => {
  it('renders page heading and intro', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
    expect(screen.getByText(/want to reach us/i)).toBeInTheDocument();
  });

  it('renders phone link with tel href', () => {
    render(<Contact />);
    const phoneLink = screen.getByRole('link', { name: siteInfo.phone });
    expect(phoneLink).toHaveAttribute('href', contactLinks.phone);
  });

  it('renders support email links with mailto hrefs and subjects', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: /product support/i })).toHaveAttribute(
      'href',
      contactLinks.productSupport,
    );
    expect(screen.getByRole('link', { name: /general inquiries/i })).toHaveAttribute(
      'href',
      contactLinks.generalInquiry,
    );
    expect(screen.getByRole('link', { name: /billing inquiries/i })).toHaveAttribute(
      'href',
      contactLinks.billingInquiry,
    );
  });

  it('renders business hours', () => {
    render(<Contact />);
    expect(screen.getByText(siteInfo.hours)).toBeInTheDocument();
  });

  it('renders accessible section headings', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: /talk to us/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact support/i })).toBeInTheDocument();
  });
});
