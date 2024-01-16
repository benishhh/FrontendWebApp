import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Group, FileInput, Select } from '@mantine/core';
import { getBrands } from '../services/api/brand';
import {addListing} from "../services/api/listing";

export interface ListingFormData {
    title: string;
    description: string;
    brandId: string | null;
    carModel: string | null;
    carYear: number;
    carMileage: number;
    carEngineType: string | null;
    carEngineSize: number;
    carPrice: number;
    imageUrl: string;
}

export const CarAddNew = () => {
    const [brands, setBrands] = useState<{ value: string; label: string; models: string[] }[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>('');
    const [models, setModels] = useState<string[]>([]);
    const [formData, setFormData] = useState<ListingFormData>({
        title: '',
        description: '',
        brandId: '',
        carModel: '',
        carYear: 0,
        carMileage: 0,
        carEngineType: '',
        carEngineSize: 0,
        carPrice: 0,
        imageUrl: '',
    });

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


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
            try {
                const response = await addListing(formData);
                console.log('Ogłoszenie dodane:', response.data);
            } catch (error) {
                console.error('Błąd przy dodawaniu ogłoszenia:', error);
            }
    };

    const engineTypes = [
        { value: 'gasoline', label: 'Benzyna' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'electric', label: 'Elektryczny' },
        { value: 'hybrid', label: 'Hybrydowy' },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                label="Tytuł"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.currentTarget.value })}
                required
            />
            <Select
                label="Marka"
                value={selectedBrand}
                onChange={(inputValue) => {
                    setSelectedBrand(inputValue);
                    setFormData({ ...formData, brandId: inputValue });
                    const brand = brands.find(b => b.value === inputValue);
                    setModels(brand ? brand.models : []);
                    console.log(brand?.models);
                }}
                data={brands.map(brand => ({ value: brand.value, label: brand.label }))}
                required
            />
            <Select
                label="Model"
                value={formData.carModel}
                onChange={(value) => setFormData({ ...formData, carModel: value })}
                data={models.map(model => ({ value: model, label: model }))}
                disabled={!selectedBrand}
                required
            />
            <Textarea
                label="Opis"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.currentTarget.value })}
                required
            />
            <Textarea
                label="Url do zdjęcia"
                value={formData.imageUrl}
                onChange={(event) => setFormData({ ...formData, imageUrl: event.currentTarget.value })}
            />

            <TextInput
                label="Rok produkcji"
                type="number"
                value={formData.carYear}
                onChange={(event) => setFormData({ ...formData, carYear: parseInt(event.currentTarget.value) })}
                required
            />

            <TextInput
                label="Przebieg (km)"
                type="number"
                value={formData.carMileage}
                onChange={(event) => setFormData({ ...formData, carMileage: parseInt(event.currentTarget.value) })}
                required
            />
            <Select
                label="Typ silnika"
                value={formData.carEngineType}
                onChange={(value) => setFormData({ ...formData, carEngineType: value })}
                data={engineTypes}
                required
            />
            <TextInput
                label="Pojemność silnika (cm³)"
                type="number"
                value={formData.carEngineSize}
                onChange={(event) => setFormData({ ...formData, carEngineSize: parseInt(event.currentTarget.value) })}
                required
            />

            <TextInput
                label="Cena (PLN)"
                type="number"
                value={formData.carPrice}
                onChange={(event) => setFormData({ ...formData, carPrice: parseInt(event.currentTarget.value) })}
                required
            />
            <Group mt="md">
                <Button type="submit">Dodaj ogłoszenie</Button>
            </Group>
        </form>
        );
};



// import React, { useState } from 'react';
// import { TextInput, Textarea, Button, Group, FileInput } from '@mantine/core';
//
// interface CarFormData {
//     title: string;
//     description: string;
//     brand: string;
//     image: File | null;
//     userId: string;
// }
//
// export const CarAddNew = () => {
//     // Załóżmy, że możemy pobrać ID użytkownika w ten sposób
//     const userId = localStorage.getItem('userId') || 'unknown';
//
//     const [formData, setFormData] = useState<CarFormData>({
//         title: '',
//         description: '',
//         brand: '',
//         image: null,
//         userId: userId // Ustawienie ID użytkownika
//     });
//
//     const handleSubmit = (event: React.FormEvent) => {
//         event.preventDefault();
//         // Obsługa wysyłania danych formularza
//         console.log(formData);
//     };
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="hidden" name="userId" value={formData.userId} />
//             <TextInput
//                 label="Tytuł"
//                 value={formData.title}
//                 onChange={(event) => setFormData({ ...formData, title: event.currentTarget.value })}
//                 required
//             />
//             <TextInput
//                 label="Marka"
//                 value={formData.brand}
//                 onChange={(event) => setFormData({ ...formData, brand: event.currentTarget.value })}
//                 required
//             />
//             <Textarea
//                 label="Opis"
//                 value={formData.description}
//                 onChange={(event) => setFormData({ ...formData, description: event.currentTarget.value })}
//                 required
//             />
//             <FileInput
//                 label="Wgraj zdjęcie"
//                 accept="image/*"
//                 onChange={(event) => setFormData({ ...formData, image: event })}
//             />
//             <Group mt="md">
//                 <Button type="submit">Dodaj ogłoszenie</Button>
//             </Group>
//         </form>
//     );
// };
