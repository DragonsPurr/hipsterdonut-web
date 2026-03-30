import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the main tagline', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dragon's Purr Crafts and Sundry/i })).toBeInTheDocument();
    expect(
      screen.getByText(/brand that specializes in apparel featuring dopey-as-hell pop-culture mashups/i)
    ).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Home />);
    expect(screen.getByAltText('Hipster Donut Apparel logo')).toBeInTheDocument();
  });

  it('logo has correct src', () => {
    render(<Home />);
    const img = screen.getByRole('img', { name: /hipster donut apparel logo/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('hipsterdonut_square-orig-colour.png'));
  });
});
