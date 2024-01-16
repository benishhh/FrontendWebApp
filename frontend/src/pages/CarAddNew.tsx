import React, { useState } from 'react';
import { TextInput, Textarea, Button, Group, FileInput } from '@mantine/core';

interface CarFormData {
    title: string;
    description: string;
    brand: string;
    image: File | null;
    userId: string;
}

export const CarAddNew = () => {
    // Załóżmy, że możemy pobrać ID użytkownika w ten sposób
    const userId = localStorage.getItem('userId') || 'unknown';

    const [formData, setFormData] = useState<CarFormData>({
        title: '',
        description: '',
        brand: '',
        image: null,
        userId: userId // Ustawienie ID użytkownika
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Obsługa wysyłania danych formularza
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="userId" value={formData.userId} />
            <TextInput
                label="Tytuł"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.currentTarget.value })}
                required
            />
            <TextInput
                label="Marka"
                value={formData.brand}
                onChange={(event) => setFormData({ ...formData, brand: event.currentTarget.value })}
                required
            />
            <Textarea
                label="Opis"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.currentTarget.value })}
                required
            />
            <FileInput
                label="Wgraj zdjęcie"
                accept="image/*"
                onChange={(event) => setFormData({ ...formData, image: event })}
            />
            <Group mt="md">
                <Button type="submit">Dodaj ogłoszenie</Button>
            </Group>
        </form>
    );
};
