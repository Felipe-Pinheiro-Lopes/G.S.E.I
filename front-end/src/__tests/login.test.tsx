import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../app/login/page';
import { api } from '@/services/api';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
    };
  },
}));

// Mock nookies
vi.mock('nookies', () => ({
  setCookie: vi.fn(),
}));

// Mock api
vi.mock('@/services/api', () => ({
  api: {
    post: vi.fn(),
    defaults: {
      headers: {},
    },
  },
}));

describe('LoginPage Component', () => {
  it('renders login form items', () => {
    render(<LoginPage />);
    expect(screen.getByText('Acesso ao Sistema')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('nome@instituicao.gov.br')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('********')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENTRAR NO SISTEMA/i })).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    const errorMsg = 'Email ou senha inválidos';
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        data: {
          message: errorMsg,
        },
      },
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('nome@instituicao.gov.br');
    const passwordInput = screen.getByPlaceholderText('********');
    const submitButton = screen.getByRole('button', { name: /ENTRAR NO SISTEMA/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});
