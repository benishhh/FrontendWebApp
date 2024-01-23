// Na początku pliku testowego, przed importami
import {within} from "@testing-library/react";

jest.mock("../services/api/brand", () => ({
    getBrands: jest.fn(),
}));

import { ListingAddNew } from "./ListingAddNew";
import { render } from '../test-utils/render';
import { screen, fireEvent } from '../test-utils/testing-utils';
import '@testing-library/jest-dom/extend-expect';
import {brandResponse, getBrands} from "../services/api/brand";

const mockBrandsResult: brandResponse = {
    success: true,
    data: {
        brands: [
            {
                _id: "65932f02e1dacefc12409e35",
                name: "Hyundai",
                carModels: ["Elantra", "i30"],
            },
            {
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
            }
        ]
    }
};

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


describe("Listing adding form - title input", () => {
    beforeEach(() => {
        // Ustawienie mocka dla getBrands przed każdym testem
        (getBrands as jest.Mock).mockResolvedValue(mockBrandsResult);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Oczyszczenie mocków po każdym teście
    });

    test('Checks if title input updates', () => {
        render(<ListingAddNew />);
        const titleInput = screen.getByTestId('title-input') as HTMLInputElement;
        const newValue = 'Fantastyczny samochód'
        fireEvent.change(titleInput, { target: { value: newValue} });
        expect(titleInput.value).toBe(newValue);
    })

    it('Checks if brand input updates', () => {
        render(<ListingAddNew />);
        const brandInput = screen.getByTestId('brand-input')  as HTMLInputElement;;
        const newValue = 'VODZWAGEN'
        fireEvent.change(brandInput, { target: { value: newValue} });
        expect(brandInput.value).toBe(newValue);
    });

    test('displays error when car year is less than 1900', async() => {
        const { getByTestId, getByText } = render(<ListingAddNew />);
        const carYearInput = getByTestId('year-input');

        fireEvent.change(carYearInput, { target: { value: '1899' } });
        fireEvent.blur(carYearInput); // symuluje opuszczenie pola input

        // Oczekiwanie na pojawienie się błędu walidacji
        const errorMessage = await screen.findByText('Rok produkcji jest za niski');
        expect(errorMessage).toBeInTheDocument();
    });
    test('displays error when car year is more current year', async() => {
        const { getByTestId, getByText } = render(<ListingAddNew />);
        const carYearInput = getByTestId('year-input');

        fireEvent.change(carYearInput, { target: { value: 5000 } });
        fireEvent.blur(carYearInput); // symuluje opuszczenie pola input

        // Oczekiwanie na pojawienie się błędu walidacji
        const errorMessage = await screen.findByText('Rok produkcji jest za wysoki');
        expect(errorMessage).toBeInTheDocument();
    });
    test('displays error when car milage is negative', async() => {
        const { getByTestId, getByText } = render(<ListingAddNew />);
        const carMilageInput = getByTestId('milage-input');

        fireEvent.change(carMilageInput, { target: { value: '-1' } });
        fireEvent.blur(carMilageInput); // symuluje opuszczenie pola input

        const errorMessage = await screen.findByText('Przebieg nie może być ujemny');
        expect(errorMessage).toBeInTheDocument();
    });
    test('displays error when car price is negative', async () => {
        const { getByTestId } = render(<ListingAddNew />);
        const carPriceInput = getByTestId('price-input');

        fireEvent.change(carPriceInput, { target: { value: '-100' } });
        fireEvent.blur(carPriceInput);

        const errorMessage = await screen.findByText('Cena nie może być ujemna');
        expect(errorMessage).toBeInTheDocument();
    });
    test('displays error when engine capacity is negative', async () => {
        const { getByTestId } = render(<ListingAddNew />);
        const engineSizeInput = getByTestId('engineSize-input');

        fireEvent.change(engineSizeInput, { target: { value: '-1000' } });
        fireEvent.blur(engineSizeInput);

        const errorMessage = await screen.findByText('Pojemność silnika nie może być ujemna');
        expect(errorMessage).toBeInTheDocument();
    });
    // test('enables model select after choosing a brand', async () => {
    //     const { getByTestId, findByText } = render(<ListingAddNew />);
    //
    //     const brandSelect = getByTestId('brand-input');
    //     fireEvent.change(brandSelect, { target: { value: mockBrandsResult.data.brands[0]._id }});
    //
    //     const modelSelect = getByTestId('model-input');
    //     expect(modelSelect).not.toBeDisabled();
    // });
});