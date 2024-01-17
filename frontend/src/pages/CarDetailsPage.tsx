import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getListingById, Listing} from '../services/api/listing';
import {Card, Center, Image, Loader, Text, Title} from '@mantine/core';

export const CarDetailsPage = () => {
    const { carId } = useParams();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (carId) {
            getListingById(carId)
                .then(response => {
                    setListing(response.data.listing);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching listing details:', error);
                    setLoading(false);
                    // Możesz dodać obsługę błędów, np. wyświetlić komunikat
                });
        }
    }, [carId]);

    if (loading) {
        return <Loader />;
    }

    if (!listing) {
        return <Text>Nie znaleziono listingu.</Text>;
    }

    return (
            <Card shadow="sm" padding="lg">
                <Center style={{ width: "100%", flexDirection: 'column' }}>
                <Title order={2}>{listing.title}</Title>

                    {listing.imageUrl && (
                        <Image
                            src={listing.imageUrl}
                            alt={listing.title}
                            style={{ margin: 'auto', maxWidth: '100%', maxHeight: '400px' }}
                        />
                    )}

                <Text>Marka: {listing.car.brand.name}</Text>
                <Text>Model: {listing.car.carModel}</Text>
                <Text>Rok produkcji: {listing.car.year}</Text>
                <Text>Przebieg: {listing.car.mileage} km</Text>
                <Text>Typ silnika: {listing.car.engineType}</Text>
                <Text>Pojemność silnika: {listing.car.engineSize} cm³</Text>
                <Text>Cena: {listing.car.price} PLN</Text>
                <Text mt="md">{listing.description}</Text>
                </Center>
            </Card>

    );
};