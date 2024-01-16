// services/userService.js

import {ListingResponse} from "./listing";

export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    listings: any[];  // Możesz zastąpić 'any' bardziej szczegółowym typem, jeśli znasz strukturę ogłoszeń
    likedListings: any[];  // Podobnie jak powyżej
    themeMode: string;
    __v: number;
}

export interface UserProfileResponse {
    success: boolean;
    data: UserProfile;
}

const getUserProfile = async (): Promise<UserProfileResponse> => {
    const API_URL = "http://localhost:8080/api/user"; // Zmień na odpowiedni URL backendu
    const token = sessionStorage.getItem('authToken'); // Pobieranie tokena z sessionStorage

    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Nie udało się pobrać danych użytkownika');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

const getUserFavoriteListings = async ():  Promise<ListingResponse> => {
    const API_URL = "http://localhost:8080/api/user/favourites"; // Zmień na odpowiedni URL backendu
    const token = sessionStorage.getItem('authToken'); // Pobieranie tokena z sessionStorage

    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Nie udało się pobrać ulubionych listingów');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user favorites:', error);
        throw error;
    }
};

export { getUserProfile, getUserFavoriteListings };
