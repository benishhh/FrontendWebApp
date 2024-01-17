import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {Button, SimpleGrid} from '@mantine/core';
import {
    getUserFavoriteListings,
    getUserListings,
    getUserProfile,
    UserProfile,
} from "../services/api/user";
import {addToFavorites, getListings, Listing, removeFromFavorites} from "../services/api/listing";
import {CarListItem, CarListItemListing} from "./CarListItem";

export const ProfilePage = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [favoriteListings, setFavoriteListings] = useState<CarListItemListing[]>([]);
    const [userListings, setUserListings] = useState<CarListItemListing[]>([]);

    const currentUserId = sessionStorage.getItem('currentUserId');

    useEffect(() => {
        getUserProfile().then(response => {
            if (response.success) {
                setUserData(response.data);
            }
        }).catch(error => {
            console.error('Błąd podczas pobierania danych usera:', error);
        })

        getUserListings().then(response => {
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
                        imageUrl: listing.imageUrl,
                        isFavorited: listing.likedByUsers.some(user => user._id === currentUserId)
                    }
                })
                setUserListings(newCarListItemListings);
            }
        }).catch(error => {
            console.error('Błąd podczas pobierania listingów:', error);
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
                        imageUrl: listing.imageUrl,
                        isFavorited: listing.likedByUsers.some(user => user._id === currentUserId)
                    }
                })
                setFavoriteListings(newCarListItemListings);
            }
        }).catch(error => {
            console.error('Błąd podczas pobierania listingów:', error);
        });
    }, [currentUserId]);

    const toggleFavorite = async (listingId: string) => {
        try {
            const listingToUpdate = favoriteListings.find(listing => listing._id === listingId);
            if (listingToUpdate) {
                if (listingToUpdate.isFavorited) {
                    await removeFromFavorites(listingId);
                } else {
                    await addToFavorites(listingId);
                }

                const updatedListings = favoriteListings.map(listing =>
                    listing._id === listingId ? {...listing, isFavorited: !listing.isFavorited} : listing
                );

                setFavoriteListings(updatedListings);
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

            {Array.isArray(favoriteListings) && favoriteListings.length > 0 ? (
                <SimpleGrid cols={3} spacing="lg" mt="lg">
                    {favoriteListings.map(listing => (
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

