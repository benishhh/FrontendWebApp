jest.mock("../services/api/user", () => ({
    getUserProfile: jest.fn(),
    getUserListings: jest.fn(),
    getUserFavoriteListings: jest.fn(),
}));

import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import {render} from "../test-utils/render";
import '@testing-library/jest-dom/extend-expect';
import {getUserFavoriteListings, getUserListings, getUserProfile} from "../services/api/user";
import {ProfilePage} from "./ProfilePage";

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

const mockUserProfile = {
    _id: "1",
    username: "Test Username",
    email: "test@example.com",
    isAdmin: false,
    listings: ["L1", "L2", "L3"],
    likedListings: ["L2", "L4", "L7"],
    themeMode: "light",
}
const mockListings = [
        {
            car: {
                brand: {
                    _id: "65a733b25f772e93e0bc9748",
                    name: "Mercedes-Benz",
                    carModels: [
                        "Klasa C",
                        "Klasa E",
                        "Klasa A",
                        "Klasa S",
                        "Klasa GLE",
                        "Klasa GLC",
                        "AMG GT",
                        "Klasa G",
                        "Klasa B"
                    ],
                },
                carModel: "Klasa A",
                year: 2007,
                mileage: 35000,
                engineType: "gasoline",
                engineSize: 1500,
                price: 234000
            },
            _id: "1",
            title: "Najlepsze auto na swiecie",
            description: "Nie wiesz co tracisz",
            imageUrl: "https://bi.im-g.pl/im/6d/f9/11/z18847853IER,Mercedes-AMG-GT-GT3.jpg",
            seller: "65a5bde1e434778b4e02c9d0",
            likedByUsers: [
                "65a5bde1e434778b4e02c9d0"
            ],
        },
        {
            car: {
                brand: {
                    _id: "2",
                    name: "BMW",
                    carModels: [
                        "Seria 1",
                        "Seria 2",
                    ],
                },
                carModel: "Seria 1",
                year: 2001,
                mileage: 190000,
                engineType: "diesel",
                engineSize: 1800,
                price: 45000
            },
            _id: "2",
            title: "Super autko",
            description: "Nie wiem gosciu co ty robisz ze spisz",
            imageUrl: "https://www.bmw.pl/content/dam/bmw/common/all-models/1-series/series-overview/bmw-1-series-sedan-ms-e87.jpg",
            seller: "1",
            likedByUsers: [
                "1",
                "5"
            ],
        }
    ]
interface MockStorage {
    [key: string]: string | null;
}
const mockStorage: MockStorage = {};
const mockedSessionStorage = {
    getItem: jest.fn((key: string) => mockStorage[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
    clear: jest.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }),
};
Object.defineProperty(window, 'sessionStorage', { value: mockedSessionStorage });

describe('ProfilePage Component', () => {

    beforeEach(() => {
        mockedNavigate.mockClear();
        (getUserProfile as jest.Mock).mockResolvedValue({
            success: true,
            data: mockUserProfile
        });
        (getUserListings as jest.Mock).mockResolvedValue({
            success: true,
            data: { listings: mockListings }
        });
        (getUserFavoriteListings as jest.Mock).mockResolvedValue({
            success: true,
            data: { listings: mockListings }
        });
    });

    test('Gets (from API call) user data and displays it correctly', async () => {
        const { getByText } = render(<ProfilePage />);

        await waitFor(() => {
            expect(getByText('Nazwa użytkownika: Test Username')).toBeInTheDocument();
            expect(getByText('Email: test@example.com')).toBeInTheDocument();
        });
    });

    test('Gets (from API calls) users and favorite listings and displays it correctly', async () => {
        render(<ProfilePage />);

        // Sprawdzenie, czy wywołania API są dokonywane
        await waitFor(() => {
            expect(getUserListings).toHaveBeenCalled();
            expect(getUserFavoriteListings).toHaveBeenCalled();
        });

        // Sprawdzenie, czy ogłoszenia są renderowane (mocki listingów polubionych i należących do użytkownika są takie same, więc length 2)
        expect(screen.getAllByText("Najlepsze auto na swiecie")).toHaveLength(2);
        expect(screen.getAllByText("Super autko")).toHaveLength(2);
    });

    test('handleLogout usuwa dane z sessionStorage/localStorage i wykonuje przekierowanie', async () => {
        render(<ProfilePage />);

        // Symulacja ustawienia danych w sessionStorage/localStorage
        sessionStorage.setItem('authToken', 'fake-token');
        sessionStorage.setItem('currentUserId', 'fake-userid');

        await waitFor(() => {
            // Symulacja kliknięcia przycisku wylogowania
            const logoutButton = screen.getByTestId('logout-button');
            fireEvent.click(logoutButton);

            // Sprawdzenie, czy dane zostały usunięte
            expect(sessionStorage.getItem('authToken')).toBeUndefined();
            expect(sessionStorage.getItem('currentUserId')).toBeUndefined();

            // Sprawdzenie, czy wykonano przekierowanie
            expect(mockedNavigate).toHaveBeenCalledWith('/moto/login');
        })
    });

});