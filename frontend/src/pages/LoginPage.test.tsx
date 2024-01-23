import { LoginPage } from "./LoginPage";
import { render, screen, fireEvent } from '../test-utils/testing-utils';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import {act} from "react-dom/test-utils";
import {getByPlaceholderText} from "@testing-library/react";

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

// Mock global.fetch
beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const mockLoginSuccess = () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { token: 'test-token', user: { _id: 'test-id' } } }),
    });
};

const mockLoginFailure = () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: { message: 'Invalid credentials' } }),
    });
};

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe("Login form", () => {
    test('updates email and password inputs correctly', () => {
        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('Your email') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Your password') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('displays error messages for invalid inputs', async () => {
        render(<LoginPage />);

        const submitButton = screen.getByRole('button', { name: /login/i });

        // Symulacja wysłania pustego formularza
        fireEvent.click(submitButton);
        expect(await screen.findByText('Email is required')).toBeInTheDocument();
        expect(await screen.findByText('Password is required')).toBeInTheDocument();

        // Symulacja wpisania niepoprawnego formatu e-maila
        const emailInput = screen.getByPlaceholderText('Your email');
        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        fireEvent.click(submitButton);
        expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
    });

    // test('successful login redirects to profile page', async () => {
    //     mockLoginSuccess();
    //
    //     const { getByTestId, getByRole } = render(
    //             <LoginPage />
    //     );
    //
    //     const emailInput = getByTestId("email-input");
    //     const passwordInput = getByTestId('password-input');
    //     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    //     fireEvent.change(passwordInput, { target: { value: 'password123' } });
    //
    //     const loginButton = getByRole('button', { name: /login/i });
    //     fireEvent.click(loginButton);
    //
    //     expect(mockedUsedNavigate).toBeCalled();
    // });

});
