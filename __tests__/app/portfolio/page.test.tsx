import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import Portfolio from '@/app/portfolio/page';

describe('Portfolio page', () => {
  const mockPhotosResponse = {
    photos: [
      {
        id: '1',
        title: 'Test photo',
        description: 'A test description',
        url: 'https://example.com/project',
        urlMedium: 'https://example.com/1_m.jpg',
        urlLarge: 'https://example.com/1_z.jpg',
        urlModal: 'https://example.com/1_modal.jpg',
      },
    ],
    page: 1,
    pages: 2,
    total: 10,
    perPage: 18,
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPhotosResponse),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches photos from the API and displays them', async () => {
    render(<Portfolio />);
    await waitFor(() => {
      expect(screen.getByAltText('Test photo')).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/portfolio?page=1'));
  });

  it('shows pagination when there are multiple pages', async () => {
    render(<Portfolio />);
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('clicking a photo opens modal with larger image and description', async () => {
    render(<Portfolio />);
    await waitFor(() => {
      expect(screen.getByAltText('Test photo')).toBeInTheDocument();
    });
    const photoButton = screen.getByRole('button', { name: /view test photo/i });
    fireEvent.click(photoButton);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Test photo' })).toBeInTheDocument();
    expect(within(dialog).getByText('A test description')).toBeInTheDocument();
  });

  it('modal shows View project link when photo has url', async () => {
    render(<Portfolio />);
    await waitFor(() => {
      expect(screen.getByAltText('Test photo')).toBeInTheDocument();
    });
    const photoButton = screen.getByRole('button', { name: /view test photo/i });
    fireEvent.click(photoButton);
    const projectLink = screen.getByRole('link', { name: /view project/i });
    expect(projectLink).toHaveAttribute('href', 'https://example.com/project');
    expect(projectLink).toHaveAttribute('target', '_blank');
  });
});
