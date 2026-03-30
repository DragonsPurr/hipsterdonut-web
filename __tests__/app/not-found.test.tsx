import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('Not Found page', () => {
  it('renders the Page Not Found title', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders the 404 image with correct alt text', () => {
    render(<NotFound />);
    const img = screen.getByRole('img', { name: /404/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', '404');
  });

  it('404 image has correct src', () => {
    render(<NotFound />);
    const img = screen.getByRole('img', { name: /404/i });
    expect(img.getAttribute('src')).toContain('eeby-deeby-404.jpg');
  });

  it('renders the wrong turn message', () => {
    render(<NotFound />);
    expect(screen.getByText(/oh no, you seem to have taken a wrong turn/i)).toBeInTheDocument();
  });
});
