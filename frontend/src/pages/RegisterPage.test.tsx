jest.mock("../services/api/register", () => ({
    registerUser: jest.fn(),
}));

import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import {render} from "../test-utils/render";
import '@testing-library/jest-dom/extend-expect';
import { RegisterPage } from './RegisterPage';
import { registerUser } from "../services/api/register";

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {}, // Stara metoda, dla kompatybilności
        removeListener: function() {}, // Stara metoda, dla kompatybilności
        addEventListener: function() {}, // Nowa metoda
        removeEventListener: function() {} // Nowa metoda
    };
};
class ResizeObserver {
    observe() {
    }
    unobserve() {
    }
    disconnect() {
    }
}
window.ResizeObserver = ResizeObserver;

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));
describe('RegisterPage Component', () => {

    beforeEach(() => {
        mockedNavigate.mockClear();
        (registerUser as jest.Mock).mockResolvedValue({});
    });

    test('Renders all inputs and submit button correctly :)', () => {
        const { getByPlaceholderText, getByText } = render(<RegisterPage />);

        expect(getByPlaceholderText('Your username')).toBeInTheDocument();
        expect(getByPlaceholderText('Your email')).toBeInTheDocument();
        expect(getByPlaceholderText('Your password')).toBeInTheDocument();
        expect(getByPlaceholderText('Confirm your password')).toBeInTheDocument();
        expect(getByText('Register')).toBeInTheDocument();
    });

    test('Displays validation messages when clicking submit button with wrong data', async () => {
        const { getByText, getByRole } = render(<RegisterPage />);
        fireEvent.click(getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            const usernameError = getByText('Username is required');
            const emailError = getByText('Email is required');
            const passwordError = getByText('Password is required');
            const confirmPasswordError = getByText('Confirm your password');
            expect(usernameError).toBeInTheDocument();
            expect(emailError).toBeInTheDocument();
            expect(passwordError).toBeInTheDocument();
            expect(confirmPasswordError).toBeInTheDocument();
        });
    });

    test('Navigates to /login after successful registration', async () => {
        render(<RegisterPage />);

        // Wypełnianie i wysyłanie formularza
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            // Sprawdzenie, czy useNavigate zostało wywołane z odpowiednim adresem URL
            expect(mockedNavigate).toHaveBeenCalledWith('/moto/login');
        });
    })
    // Inne testy, jak testowanie poprawnego działania formularza, przekierowania, itp.
});