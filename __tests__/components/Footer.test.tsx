import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders Dragon\'s Purr Crafts and Sundry link', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link', { name: /dragon's purr crafts and sundry/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', 'https://dragonspurr.ca');
  });

  it('renders current year in copyright', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`©\\s*${year}`, 'i'))).toBeInTheDocument();
  });

  it('Boxing Octopus Creative link opens in new tab', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /boxing octopus creative/i })).toHaveAttribute('target', '_blank');
  });
});
