import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from '@mantine/core';
import {mockCars} from "../data/mockData";


export const ProfilePage = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        // Usuń dane związane z sesją użytkownika
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');

        // Przekieruj na stronę logowania
        navigate('/moto/login');
    };


    // Odczytywanie danych użytkownika z localStorage
    const storedData = localStorage.getItem('userData');
    const userData = storedData ? JSON.parse(storedData) : null;

    // Odczytywanie ulubionych ogłoszeń
    const storedFavorites = localStorage.getItem('favoriteCars');
    const favoriteCarIds = storedFavorites ? JSON.parse(storedFavorites) : [];

    // Filtrowanie ulubionych ogłoszeń z mockCars
    const favoriteCars = mockCars.filter(car => favoriteCarIds.includes(car.id));


    // Jeśli dane użytkownika nie są dostępne, pokazuje komunikat
    if (!userData) {
        return <p>Nie znaleziono danych użytkownika. Proszę się zalogować.</p>;
    }

    return (
        <div>
            <h1>Profil Użytkownika</h1>
            <p>Nazwa użytkownika: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <Button onClick={handleLogout} variant={"filled"} color={"gray"}>Wyloguj się</Button>

            <h2>Polubione</h2>
            {favoriteCars.length > 0 ? (
                <ul>
                    {favoriteCars.map(car => (
                        <li key={car.id}>
                            {car.title} - {car.description}
                            {/* Tutaj możesz dodać więcej szczegółów ogłoszenia lub komponent CarListItem, jeśli jest dostępny */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nie masz jeszcze ulubionych ogłoszeń.</p>
            )}
        </div>
    );
};
