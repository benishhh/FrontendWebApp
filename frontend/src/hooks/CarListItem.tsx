import React from 'react';
import { Card, Image, Text, Button } from '@mantine/core';
import {IconHeart} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";

interface CarListItemProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    isFavorited: boolean;
    onToggleFavorite: (id: number) => void;
}

export const CarListItem = ({ id, title, description, imageUrl, isFavorited, onToggleFavorite }: CarListItemProps) => {

    const navigate = useNavigate();

    // Funkcja do nawigacji do strony szczegółów samochodu
    const navigateToCarDetails = () => {
        navigate(`/moto/car/${id}`);
    };
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Zatrzymuje propagację, więc kliknięcie nie będzie "bąbelkować" w górę
        onToggleFavorite(id);
    };

    return (
        <Card shadow="sm" p="lg" radius="md" onClick={navigateToCarDetails}>
            <Card.Section>
                <Image src={imageUrl} alt={title} height={210} />
            </Card.Section>
            <Text size="lg">{title}</Text>
            <Text size="sm">{description}</Text>
            <Button onClick={handleFavoriteClick} mt="md" variant={"filled"} color="pink" radius="lg" leftSection={<IconHeart/>}>
                {isFavorited ? 'Usuń z Ulubionych' : 'Dodaj do Ulubionych'}
            </Button>
        </Card>
    );
};
