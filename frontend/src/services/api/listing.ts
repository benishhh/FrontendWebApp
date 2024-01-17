import {ListingFormData} from "../../pages/CarAddNew";

export interface Brand {
    _id: string;
    name: string;
}

export interface User {
    _id: string;
    username: string;
}

export interface CarDetails {
    _id: string,
    brand: Brand;
    carModel: string;
    year: number;
    mileage: number;
    engineType: "diesel" | "gasoline" | "electric" | "hybrid";
    engineSize: number;
    price: number;
}

export interface Listing {
    _id: string;
    title: string;
    description: string;
    car: CarDetails;
    imageUrl: string;
    seller: User;
    likedByUsers: User[];
    __v: number;
}

export interface ListingsResponse {
    success: boolean;
    data: {
        listings: Listing[];
    };
}

export interface  ListingResponse {
    success: boolean;
    data: {
        listing: Listing
    };
}

export interface ListingToAdd {
    title: string;
    description: string;
}

const getListings = async (): Promise<ListingsResponse> => {
    const API_URL = "http://localhost:8080/api/listings"; // Zmień na odpowiedni URL backendu
    const token = sessionStorage.getItem('authToken'); // Pobieranie tokena z sessionStorage

    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Nie udało się pobrać danych ogłoszeń');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};


const API_BASE_URL = 'http://localhost:8080/api/listings';
const addToFavorites = async (listingId: string): Promise<any> => {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/${listingId}/likes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Nie udało się dodać do ulubionych');
    }

    return await response.json();
};

const removeFromFavorites = async (listingId: string): Promise<any> => {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/${listingId}/likes`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Nie udało się usunąć z ulubionych');
    }

    return await response.json();
};

// services/listingService.js

export const addListing = async (listingData: ListingFormData) => {
    const API_URL = 'http://localhost:8080/api/listings';
    const token = sessionStorage.getItem('authToken');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(listingData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Nie udało się dodać ogłoszenia');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding listing:', error);
        throw error;
    }
};

const getListingById = async (listingId: string): Promise<ListingResponse> => {
    const API_URL = `http://localhost:8080/api/listings/${listingId}`;
    const token = sessionStorage.getItem('authToken'); // Jeśli wymagana jest autoryzacja

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Dodaj nagłówek, jeśli jest wymagany
            }
        });

        if (!response.ok) {
            throw new Error('Nie udało się pobrać danych listingu');
        }

        const data: ListingResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching listing:', error);
        throw error;
    }
};

export { addToFavorites, removeFromFavorites, getListings, getListingById };
