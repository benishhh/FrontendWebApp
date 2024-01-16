import {addToFavorites, getListings, removeFromFavorites} from "../services/api/listing";
import React, {useEffect, useState} from "react";
import {CarListItem, CarListItemListing} from "../hooks/CarListItem";
import {SimpleGrid} from "@mantine/core";

export const CarListPage = () => {
    const [listings, setListings] = useState<CarListItemListing[]>([]);
    const currentUserId = sessionStorage.getItem('currentUserId');

    useEffect(() => {
        getListings().then(response => {
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

    return (
        <SimpleGrid cols={3} spacing="lg" mt="lg">
            {Array.isArray(listings) && listings.map(listing => (
                <CarListItem
                    key={listing._id}
                    {...listing}
                    onToggleFavorite={toggleFavorite}
                />
            ))}
        </SimpleGrid>


    );
};

// import {addToFavorites, getListings, removeFromFavorites} from "../services/api/listing";
// import React, {useEffect, useState} from "react";
// import {CarListItem} from "../hooks/CarListItem";
// import {SimpleGrid} from "@mantine/core";
//
// export interface CarProps {
//     id: string;
//     title: string;
//     brand: string;
//     model: string;
//     year: number;
//     mileage: number;
//     price: number;
//     isFavorited: boolean;
// }
//
// export const CarListPage = () => {
//     const [cars, setCars] = useState<CarProps[]>([]);
//
//     const currentUserId= sessionStorage.getItem('currentUserId');
//
//     useEffect(() => {
//         getListings().then(response => {
//             if (response.success) {
//                 const carData = response.data.listings.map(listing => {
//                     return {
//                         id: listing._id,
//                         title: listing.title,
//                         brand: listing.car.brand.name,
//                         model: listing.car.carModel,
//                         year: listing.car.year,
//                         mileage: listing.car.mileage,
//                         price: listing.car.price,
//                         isFavorited: listing.likedByUsers.some(user => user._id === currentUserId)
//                     };
//                 });
//                 setCars(carData);
//             }
//         }).catch(error => console.error(error));
//     }, [currentUserId]);
//
//         const toggleFavorite = async (carId: string) => {
//             try {
//                 const car = cars.find(car => car.id === carId);
//                 if (car) {
//                     if (car.isFavorited) {
//                         await removeFromFavorites(carId);
//                     } else {
//                         await addToFavorites(carId);
//                     }
//
//                     const updatedCars = cars.map(car => (
//                         car.id === carId ? { ...car, isFavorited: !car.isFavorited } : car
//                     ));
//                     setCars(updatedCars);
//                 }
//             } catch (error) {
//                 console.error('Błąd przy zmianie stanu ulubionych:', error);
//             }
//         };
//
//     return (
//         <SimpleGrid cols={3} spacing="lg" mt="lg">
//             {cars.map(car => (
//                 <CarListItem
//                     key={car.id}
//                     {...car}
//                     onToggleFavorite={toggleFavorite}
//                 />
//             ))}
//         </SimpleGrid>
//
//
//     );
// };


// import React, {useState} from 'react';
// import {Button, Card, SimpleGrid} from '@mantine/core';
// import {CarListItem} from "../hooks/CarListItem";
// import {mockCars} from "../data/mockData";
// import { Link } from 'react-router-dom';
// import {IconHeart} from "@tabler/icons-react";
//
//
//
// export const CarListPage = () => {
//     const [cars, setCars] = useState(mockCars);
//
//     const toggleFavorite = (carId: string) => {
//         const updatedCars = cars.map(car => (
//             car.id.toString() === carId ? { ...car, isFavorited: !car.isFavorited } : car
//         ));
//         setCars(updatedCars);
//         // Tutaj powinna być komunikacja z backendem
//         // Aktualizacja ulubionych w localStorage
//         const newFavorites = updatedCars.filter(car => car.isFavorited).map(car => car.id);
//         localStorage.setItem('favoriteCars', JSON.stringify(newFavorites));
//     };
//
//     return (
//         <SimpleGrid cols={3} spacing="lg" mt="lg">
//             {cars.map(car => (
//                 <CarListItem
//                     key={car.id}
//                     {...car}
//                     onToggleFavorite={toggleFavorite}
//                 />
//             ))}
//         </SimpleGrid>
//
//
//     );
// };
