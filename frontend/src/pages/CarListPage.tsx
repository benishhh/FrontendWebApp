import React, {useState} from 'react';
import {Button, Card, SimpleGrid} from '@mantine/core';
import {CarListItem} from "../hooks/CarListItem";
import {mockCars} from "../data/mockData";
import { Link } from 'react-router-dom';
import {IconHeart} from "@tabler/icons-react";



export const CarListPage = () => {
    const [cars, setCars] = useState(mockCars);

    const toggleFavorite = (carId: number) => {
        const updatedCars = cars.map(car => (
            car.id === carId ? { ...car, isFavorited: !car.isFavorited } : car
        ));
        setCars(updatedCars);
        // Tutaj powinna być komunikacja z backendem
        // Aktualizacja ulubionych w localStorage
        const newFavorites = updatedCars.filter(car => car.isFavorited).map(car => car.id);
        localStorage.setItem('favoriteCars', JSON.stringify(newFavorites));
    };

    return (
        <SimpleGrid cols={3} spacing="lg" mt="lg">
            {cars.map(car => (
                <CarListItem
                    key={car.id}
                    {...car}
                    onToggleFavorite={toggleFavorite}
                />
            ))}
        </SimpleGrid>


    );
};
