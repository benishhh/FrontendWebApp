import {Button, Card, Text, Image} from "@mantine/core";
import {IconHeart} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";

export interface CarListItemProps {
    id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    isFavorited: boolean;
    onToggleFavorite: (carId: string) => void;
}

export const CarListItem = ({
                                id,
                                title,
                                brand,
                                model,
                                year,
                                mileage,
                                price,
                                isFavorited,
                                onToggleFavorite
                            }: CarListItemProps) => {
    const navigate = useNavigate();

    const navigateToCarDetails = () => {
        navigate(`/moto/car/${id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        onToggleFavorite(id);
    };

    const imageUrl = "data:image/jpeg;base64,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";

    return (
        <Card shadow="sm" p="lg" radius="md" onClick={navigateToCarDetails}>
            <Card.Section>
                <Image src={imageUrl} alt={title} height={210} />
            </Card.Section>
            <Text size="lg">{title}</Text>
            <Text size="sm">{brand} {model} - {year}</Text>
            <Text size="sm">Przebieg: {mileage} km</Text>
            <Text size="sm">Cena: ${price}</Text>
            <Button onClick={handleFavoriteClick} mt="md" variant="filled" color="pink" radius="lg" leftSection={<IconHeart/>}>
                {isFavorited ? 'Usuń z Ulubionych' : 'Dodaj do Ulubionych'}
            </Button>
        </Card>
    );
};


// import React from 'react';
// import { Card, Image, Text, Button } from '@mantine/core';
// import {IconHeart} from "@tabler/icons-react";
// import {useNavigate} from "react-router-dom";
//
// interface CarListItemProps {
//     id: number;
//     title: string;
//     description: string;
//     imageUrl: string;
//     isFavorited: boolean;
//     onToggleFavorite: (id: number) => void;
// }
//
// export const CarListItem = ({ id, title, description, imageUrl, isFavorited, onToggleFavorite }: CarListItemProps) => {
//
//     const navigate = useNavigate();
//
//     // Funkcja do nawigacji do strony szczegółów samochodu
//     const navigateToCarDetails = () => {
//         navigate(`/moto/car/${id}`);
//     };
//     const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//         e.stopPropagation(); // Zatrzymuje propagację, więc kliknięcie nie będzie "bąbelkować" w górę
//         onToggleFavorite(id);
//     };
//
//     return (
//         <Card shadow="sm" p="lg" radius="md" onClick={navigateToCarDetails}>
//             <Card.Section>
//                 <Image src={imageUrl} alt={title} height={210} />
//             </Card.Section>
//             <Text size="lg">{title}</Text>
//             <Text size="sm">{description}</Text>
//             <Button onClick={handleFavoriteClick} mt="md" variant={"filled"} color="pink" radius="lg" leftSection={<IconHeart/>}>
//                 {isFavorited ? 'Usuń z Ulubionych' : 'Dodaj do Ulubionych'}
//             </Button>
//         </Card>
//     );
// };
