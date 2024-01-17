import {Button, Card, Text, Image} from "@mantine/core";
import {IconHeart} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";

export interface CarListItemListing {
    _id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    imageUrl: string;
    isFavorited?: boolean;
}

export interface CarListItemProps extends CarListItemListing {
    onToggleFavorite: (listingId: string) => void;
}

export const CarListItem = ({_id, title, brand, model, year, mileage, price, imageUrl, isFavorited, onToggleFavorite}: CarListItemProps) => {
    const navigate = useNavigate();

    const navigateToCarDetails = () => {
        navigate(`/moto/car/${_id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        onToggleFavorite(_id);
    };


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
