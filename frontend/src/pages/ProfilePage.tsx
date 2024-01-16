import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {Button, SimpleGrid} from '@mantine/core';
import {
    getUserFavoriteListings,
    getUserListings,
    getUserProfile,
    UserProfile,
    UserProfileResponse
} from "../services/api/user";
import {addToFavorites, getListings, Listing, removeFromFavorites} from "../services/api/listing";
import {CarListItem, CarListItemListing} from "../hooks/CarListItem";

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [listings, setListings] = useState<CarListItemListing[]>([]);
    const currentUserId = sessionStorage.getItem('currentUserId');
    const [userListings, setUserListings] = useState<CarListItemListing[]>([]);

    useEffect(() => {
        getUserProfile().then(response => {
            if (response.success) {
                setUserData(response.data);
            }
        }).catch(error => {
            console.error('Błąd podczas pobierania danych usera:', error);
        })

        getUserListings().then(response => {
            const newUserListings = response.data.listings.map(listing =>{
                return {
                _id: listing._id,
                title: listing.title,
                brand: listing.car.brand.name,
                model: listing.car.carModel,
                year: listing.car.year,
                mileage: listing.car.mileage,
                price: listing.car.price,
                isFavorited: listing.likedByUsers.some(user => user._id === currentUserId)
            }
            setUserListings(newUserListings)});
        }).catch(error => {
            console.error("Błąd podczas pobierania ogłoszeń użytkownika:", error);
        });


        getUserFavoriteListings().then(response => {
            if (response.success) {
                const newCarListItemListings = response.data.listings.map(listing =>{
                    return {
                        _id: listing._id,
                        title: listing.title,
                        brand: listing.car.brand.name,
                        model: listing.car.carModel,
                        year: listing.car.year,
                        mileage: listing.car.mileage,
                        price: listing.car.price,
                        isFavorited: listing.likedByUsers.some(user => user._id === currentUserId)
                    }
                })
                setListings(newCarListItemListings);
            }
        }).catch(error => {
            console.error('Błąd podczas pobierania listingów:', error);
        });
    }, [currentUserId]);

    const toggleFavorite = async (listingId: string) => {
        try {
            const listingToUpdate = listings.find(listing => listing._id === listingId);
            if (listingToUpdate) {
                if (listingToUpdate.isFavorited) {
                    await removeFromFavorites(listingId);
                } else {
                    await addToFavorites(listingId);
                }

                const updatedListings = listings.map(listing =>
                    listing._id === listingId ? {...listing, isFavorited: !listing.isFavorited} : listing
                );

                setListings(updatedListings);
            }
        } catch (error) {
            console.error('Błąd przy zmianie stanu ulubionych:', error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('authToken'); // Usuwanie tokena z sessionStorage
        sessionStorage.removeItem('currentUserId'); // Usuwanie tokena z sessionStorage
        localStorage.removeItem('isLoggedIn');

        navigate('/moto/login');
    };

    if (!userData) {
        return <p>Ładowanie danych użytkownika...</p>;
    }

    return (
        <div>
            <h1>Profil Użytkownika</h1>
            <p>Nazwa użytkownika: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <Button onClick={handleLogout} variant={"filled"} color={"gray"}>Wyloguj się</Button>

            {/* Wyświetlanie ulubionych ogłoszeń*/}
            <h2>Polubione ogłoszenia</h2>

            {Array.isArray(listings) && listings.length > 0 ? (
                <SimpleGrid cols={3} spacing="lg" mt="lg">
                    {listings.map(listing => (
                        <CarListItem
                            key={listing._id}
                            {...listing}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <p>Nie masz jeszcze polubionych ogłoszeń.</p>
            )}

            <h2>Twoje ogłoszenia</h2>

            {userListings.length > 0 ? (
                <SimpleGrid cols={3} spacing="lg" mt="lg">
                    {userListings.map(listing => (
                        <CarListItem
                            key={listing._id}
                            {...listing}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <p>Nie dodałeś(aś) jeszcze żadnych ogłoszeń.</p>
            )}

        </div>
    );
};


// import React from 'react';
// import {useNavigate} from "react-router-dom";
// import {Button} from '@mantine/core';
// import {mockCars} from "../data/mockData";
//
//
// export const ProfilePage = () => {
//
//     const navigate = useNavigate();
//
//     const handleLogout = () => {
//         // Usuń dane związane z sesją użytkownika
//         localStorage.removeItem('userData');
//         localStorage.removeItem('isLoggedIn');
//
//         // Przekieruj na stronę logowania
//         navigate('/moto/login');
//     };
//
//
//     // Odczytywanie danych użytkownika z localStorage
//     const storedData = localStorage.getItem('userData');
//     const userData = storedData ? JSON.parse(storedData) : null;
//
//     // Odczytywanie ulubionych ogłoszeń
//     const storedFavorites = localStorage.getItem('favoriteCars');
//     const favoriteCarIds = storedFavorites ? JSON.parse(storedFavorites) : [];
//
//     // Filtrowanie ulubionych ogłoszeń z mockCars
//     const favoriteCars = mockCars.filter(car => favoriteCarIds.includes(car.id));
//
//
//     // Jeśli dane użytkownika nie są dostępne, pokazuje komunikat
//     if (!userData) {
//         return <p>Nie znaleziono danych użytkownika. Proszę się zalogować.</p>;
//     }
//
//     return (
//         <div>
//             <h1>Profil Użytkownika</h1>
//             <p>Nazwa użytkownika: {userData.username}</p>
//             <p>Email: {userData.email}</p>
//             <Button onClick={handleLogout} variant={"filled"} color={"gray"}>Wyloguj się</Button>
//
//             <h2>Polubione</h2>
//             {favoriteCars.length > 0 ? (
//                 <ul>
//                     {favoriteCars.map(car => (
//                         <li key={car.id}>
//                             {car.title} - {car.description}
//                             {/* Tutaj możesz dodać więcej szczegółów ogłoszenia lub komponent CarListItem, jeśli jest dostępny */}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>Nie masz jeszcze ulubionych ogłoszeń.</p>
//             )}
//         </div>
//     );
// };
