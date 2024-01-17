import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getListingById, Listing } from '../services/api/listing';
import {Loader, Card, Text, Title, Image, Group, Center} from '@mantine/core';

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

                <Text size="sm">Marka: {listing.car.brand.name}</Text>
                <Text size="sm">Model: {listing.car.carModel}</Text>
                <Text size="sm">Rok produkcji: {listing.car.year}</Text>
                <Text size="sm">Przebieg: {listing.car.mileage} km</Text>
                <Text size="sm">Typ silnika: {listing.car.engineType}</Text>
                <Text size="sm">Pojemność silnika: {listing.car.engineSize} cm³</Text>
                <Text size="sm">Cena: {listing.car.price} PLN</Text>
                <Text mt="md">{listing.description}</Text>
                </Center>
            </Card>

    );
};