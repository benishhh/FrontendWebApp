import {waitFor} from "@testing-library/react";

jest.mock("../services/api/listing", () => ({
    getListings: jest.fn(),
}));

import {CarListPage} from "./CarListPage";
import { render } from '../test-utils/render';
import { screen, fireEvent } from '../test-utils/testing-utils';
import '@testing-library/jest-dom/extend-expect';
import {getListings} from "../services/api/listing";
import {getBrands} from "../services/api/brand";

// Dane testowe
const mockListings = [
    {
        _id: '1',
        title: 'Test Car 1',
        car: {
            _id: '1',
            brand: {
                _id: '65932f02e1dacefc12409e35',
                name: 'Hyundai',
            },
            carModel: 'Elantra',
            year: 2022,
            mileage: 10000,
            engineType: 'gasoline',
            engineSize: 2000,
            price: 20000,
        },
        imageUrl: 'image1.jpg',
        seller: {
            _id: 'seller1',
            username: 'user1',
        },
        likedByUsers: [],
        __v: 0,
    },
    {
        _id: '2',
        title: 'Test Car 2',
        car: {
            _id: '2',
            brand: {
                _id: '65a733b25f772e93e0bc9748',
                name: 'Mercedes-Benz',
            },
            carModel: 'Klasa C',
            year: 2021,
            mileage: 8000,
            engineType: 'diesel',
            engineSize: 2500,
            price: 30000,
        },
        imageUrl: 'image2.jpg',
        seller: {
            _id: 'seller2',
            username: 'user2',
        },
        likedByUsers: [],
        __v: 0,
    },
];

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
describe("CarListPage Component", () => {
    beforeEach(() => {
        // Ustawienie mocka dla getBrands przed każdym testem
        (getListings as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                listings: mockListings,
            },
        });
    });

    test('displays list of listings', async () => {
        // Renderowanie komponentu CarListPage
        render(<CarListPage />);

        // Funckja z useEffect getListings wywołana tylko raz.
        expect(getListings).toHaveBeenCalledTimes(1);
        // Sprawdzanie czy wszytkie (mockowe) dane są wyświetlane
        const listingElements = await screen.findAllByText(/Test Car/i);
        expect(listingElements).toHaveLength(mockListings.length); // 2

        // Oczekuj, że tytuły ogłoszeń są wyświetlane poprawnie
        mockListings.forEach((listing) => {
            expect(screen.getByText(listing.title)).toBeInTheDocument();
        });
    });

    test('filtruje listę ogłoszeń po zmianie marki', async () => {
        const { getByLabelText, findAllByText, getByPlaceholderText } = render(<CarListPage />);

        const select = getByPlaceholderText('Wybierz markę');
        fireEvent.change(select, { target: { value: 'Hyundai' } });

        const filteredListings = await screen.findAllByText(/Hyundai/i);
        expect(filteredListings).toHaveLength(1); // 1 liczba ogłoszeń dla Marki Hyundai z mocka

        console.log(filteredListings);
    });


})