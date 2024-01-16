
export interface Brand {
    _id: string;
    name: string;
}

export interface User {
    _id: string;
    username: string;
}

export interface CarDetails {
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
    seller: User;
    likedByUsers: User[];
    __v: number;
}

export interface ListingResponse {
    success: boolean;
    data: {
        listings: Listing[];
    };
}

const getListings = async (): Promise<ListingResponse> => {
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

export { addToFavorites, removeFromFavorites, getListings };
