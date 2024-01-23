import {addToFavorites, getListings, removeFromFavorites} from "../services/api/listing";
import React, {useEffect, useState} from "react";
import {CarListItem, CarListItemListing} from "./CarListItem";
import {Button, Group, Select, SimpleGrid} from "@mantine/core";
import {getBrands} from "../services/api/brand";

export const CarListPage = () => {
    const [listings, setListings] = useState<CarListItemListing[]>([]);
    const currentUserId = sessionStorage.getItem('currentUserId');
    const [brands, setBrands] = useState<{ value: string; label: string; models: string[] }[]>([]);

    const [selectedBrand, setSelectedBrand] = useState<string | null>('');
    //const [selectedEngineType, setSelectedEngineType] = useState('');


    useEffect(() => {
        getBrands().then(response => {
            const brandOptions = response.data.brands.map(brand => ({
                value: brand._id,
                label: brand.name,
                models: brand.carModels,
            }));
            setBrands(brandOptions);
        });
    }, []);

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
                        imageUrl: listing.imageUrl,
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

    const filteredListings = listings.filter(listing => {
        return (selectedBrand ? listing.brand === selectedBrand : true)
           // (selectedEngineType? listing.engineType === selectedEngineType : true);
    });

    return (
        <div>
            <form>
                <Group>
                    <Select
                        label="Marka"
                        placeholder="Wybierz markę"
                        value={selectedBrand}
                        onChange={(e) => { setSelectedBrand(e); console.log(e)} }
                        data={brands.map(brand => ({ value: brand.label, label: brand.label }))}
                    />
                    <Button onClick={() => { setSelectedBrand(''); }}>
                        Wyczyść filtry
                    </Button>
                </Group>
            </form>

        <SimpleGrid cols={3} spacing="lg" mt="lg">
            {Array.isArray(filteredListings) && filteredListings.map(listing => (
                <CarListItem
                    key={listing._id}
                    {...listing}
                    onToggleFavorite={toggleFavorite}
                />
            ))}
        </SimpleGrid>
</div>

    );
};
