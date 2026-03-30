import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '@/app/contact/page';

const mockSendForm = jest.fn();
const mockSwalFire = jest.fn();

jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: {
    sendForm: (...args: unknown[]) => mockSendForm(...args),
  },
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: (...args: unknown[]) => mockSwalFire(...args),
  },
}));

jest.mock('@/app/lib/constants', () => {
  const actual = jest.requireActual('@/app/lib/constants');
  return {
    ...actual,
    envConfig: {
      ...actual.envConfig,
      emailjs: {
        serviceId: 'test-service',
        templateId: 'test-template',
        userId: 'test-user',
      },
    },
  };
});

describe('Contact page', () => {
  beforeEach(() => {
    mockSendForm.mockReset();
    mockSwalFire.mockReset();
  });
  it('renders the Bluesky social image with correct alt and src', () => {
    render(<Contact />);
    const img = screen.getByRole('img', { name: /hipster donut apparel on bluesky/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Hipster Donut Apparel on Bluesky');
    expect(img).toHaveAttribute('src', expect.stringContaining('Bluesky_Logo.svg'));
  });

  it('renders the Hey.Café social image with correct alt and src', () => {
    render(<Contact />);
    const img = screen.getByRole('img', { name: /hipster donut apparel on hey\.café/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Hipster Donut Apparel on Hey.Café');
    expect(img).toHaveAttribute('src', expect.stringContaining('heycafecdn'));
  });

  it('social images are wrapped in links that open in new tab', () => {
    render(<Contact />);
    const blueskyLink = screen.getByRole('link', { name: /hipster donut apparel on bluesky/i });
    expect(blueskyLink).toHaveAttribute('href', 'https://bsky.app/profile/dragonspurr.bsky.social');
    expect(blueskyLink).toHaveAttribute('target', '_blank');
  });

  it('renders the contact form', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  describe('EmailJS form submission', () => {
    it('calls emailjs.sendForm with form element and publicKey, then shows success and resets form', async () => {
      mockSendForm.mockResolvedValueOnce({});

      render(<Contact />);

      const emailInput = screen.getByLabelText(/email address/i);
      const nameInput = screen.getByLabelText(/your name/i);
      const messageInput = screen.getByLabelText(/message/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(messageInput, { target: { value: 'Hello!' } });

      const form = emailInput.closest('form');
      fireEvent.submit(form!);

      await Promise.resolve();
      await Promise.resolve();

      expect(mockSendForm).toHaveBeenCalledTimes(1);
      const [serviceId, templateId, formElement, options] = mockSendForm.mock.calls[0];
      expect(serviceId).toBe('test-service');
      expect(templateId).toBe('test-template');
      expect(formElement).toBe(form);
      expect(options).toEqual({ publicKey: 'test-user' });

      expect(mockSwalFire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Message Sent Successfully',
      });

      expect(emailInput).toHaveValue('');
      expect(nameInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });

    it('shows error alert when emailjs.sendForm fails', async () => {
      mockSendForm.mockRejectedValueOnce({ text: 'Network error' });

      render(<Contact />);

      const form = screen.getByLabelText(/email address/i).closest('form');
      fireEvent.submit(form!);

      await Promise.resolve();
      await Promise.resolve();

      expect(mockSwalFire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Oops, something went wrong',
        text: 'Network error',
      });
    });
  });
});
