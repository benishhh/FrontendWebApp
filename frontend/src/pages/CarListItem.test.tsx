import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import { render } from '../test-utils/render';
import { CarListItem } from './CarListItem';

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

const mockCar = {
    _id: '1',
    title: 'Testowy Samochód',
    brand: 'Testowa Marka',
    model: 'Testowy Model',
    year: 2020,
    mileage: 10000,
    price: 20000,
    imageUrl: 'testowy-obraz.jpg',
    isFavorited: false
};

const mockCarFavorite = {
    ...mockCar,
    isFavorited: true
};

const mockToggleFavorite = jest.fn();

// Mockowanie useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));
describe('CarListItem Component', () => {

    beforeEach(() => {
        mockedNavigate.mockClear();
    });

    test('Displays every information about the car', () => {
        const { getByText, getByAltText } = render(<CarListItem {...mockCar} onToggleFavorite={mockToggleFavorite} />);

        expect(getByText('Testowy Samochód')).toBeInTheDocument();
        expect(getByText('Testowa Marka Testowy Model - 2020')).toBeInTheDocument();
        expect(getByText('Przebieg: 10000 km')).toBeInTheDocument();
        expect(getByText('Cena: $20000')).toBeInTheDocument();
        expect(getByAltText('Testowy Samochód')).toBeInTheDocument();
    });

    test('Clicking Dodaj do Ulubionych activates toggle Favorite function', () => {
        const { getByText } = render( <CarListItem {...mockCar} onToggleFavorite={mockToggleFavorite} />);

        const addToFavoritesButton = getByText('Dodaj do Ulubionych')
        fireEvent.click(addToFavoritesButton);
        expect(mockToggleFavorite).toHaveBeenCalledWith('1'); // Wywołany z parametrem '1' - id mockowego auta
    });

    test('Clicking a listing Card activates useNavigate with correct url', () => {
        const { getByTestId } = render( <CarListItem {...mockCar} onToggleFavorite={mockToggleFavorite} />);

        const card = getByTestId('car-card');
        fireEvent.click(card);

        expect(mockedNavigate).toHaveBeenCalledWith(`/moto/car/${mockCar._id}`);
    });

    test('Button says Usuń z Ulubionych when listing is not favorited', () => {
        const { getByText } = render(<CarListItem {...mockCarFavorite} onToggleFavorite={mockToggleFavorite} />);
        expect(getByText('Usuń z Ulubionych')).toBeInTheDocument();
    });

    test('Button says Dodaj do Ulubionych when listing is favorited', () => {
        const { getByText } = render(<CarListItem {...mockCar} onToggleFavorite={mockToggleFavorite} />);
        expect(getByText('Dodaj do Ulubionych')).toBeInTheDocument();
    });
});