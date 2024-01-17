import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Group, FileInput, Select } from '@mantine/core';
import { getBrands } from '../services/api/brand';
import {addListing} from "../services/api/listing";
import * as yup from 'yup';
import {useFormik} from "formik";

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

const validationSchema = yup.object({
    title: yup.string().trim().required('Tytuł jest wymagany'),
    description: yup.string().trim().required('Opis jest wymagany'),
    brandId: yup.string().required('Marka jest wymagana'),
    carModel: yup.string().required('Model jest wymagany'),
    carYear: yup.number().required('Rok produkcji jest wymagany').min(1900, 'Rok produkcji jest za niski').max(new Date().getFullYear(), 'Rok produkcji jest za wysoki'),
    carMileage: yup.number().required('Przebieg jest wymagany').min(0, 'Przebieg nie może być ujemny'),
    carEngineType: yup.string().required('Typ silnika jest wymagany'),
    carEngineSize: yup.number().required('Pojemność silnika jest wymagana').min(0, 'Pojemność silnika nie może być ujemna'),
    carPrice: yup.number().required('Cena jest wymagana').min(0, 'Cena nie może być ujemna'),
    imageUrl: yup.string(),
    // sellerId: yup.string().required('Identyfikator sprzedawcy jest wymagany'), // Tutaj dodaj walidację, jeśli masz już logikę przypisywania sellerId
    // brandId: yup.string().required('Identyfikator marki jest wymagany'), // Walidacja dla brandId, jeśli to pole jest wymagane
});


export const CarAddNew = () => {
    const [brands, setBrands] = useState<{ value: string; label: string; models: string[] }[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>('');
    const [models, setModels] = useState<string[]>([]);
    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

    const formik = useFormik({
        initialValues: {
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
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await addListing(values);
                console.log('Ogłoszenie dodane:', response.data);
                setIsSubmittedSuccessfully(true);
                formik.resetForm();
            } catch (error) {
                console.error('Błąd przy dodawaniu ogłoszenia:', error);
                setIsSubmittedSuccessfully(false);
            }
        },
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

    const engineTypes = [
        { value: 'gasoline', label: 'Benzyna' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'electric', label: 'Elektryczny' },
        { value: 'hybrid', label: 'Hybrydowy' },
    ];

    return (
        <form onSubmit={formik.handleSubmit}>
            <TextInput
                label="Tytuł"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
                required
            />
            <Select
                label="Marka"
                name="brandId"
                value={formik.values.brandId}
                onChange={(value) => {
                    formik.setFieldValue("brandId", value);
                    formik.setFieldTouched("brandId", true);
                    const brand = brands.find(b => b.value === value);
                    setModels(brand ? brand.models : []);
                    formik.setFieldValue("carModel", ''); // Resetowanie wybranego modelu
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.brandId && formik.errors.brandId}
               // data={brands.map(brand => ({ value: brand.value, label: brand.label }))}
                data={brands.map(brand => ({ value: brand.value, label: brand.label }))}
                required
            />
            <Select
                label="Model"
                name="carModel"
                value={formik.values.carModel}
                onChange={(value) => formik.setFieldValue("carModel", value)}
                data={models.map(model => ({ value: model, label: model }))}
                disabled={!formik.values.brandId}
                required
            />
            <Textarea
                label="Opis"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
                required
            />
            <Textarea
                label="Url do zdjęcia"
                name="imageUrl"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                error={formik.touched.imageUrl && formik.errors.imageUrl}
            />

            <TextInput
                label="Rok produkcji"
                name="carYear"
                type="number"
                value={formik.values.carYear}
                onChange={formik.handleChange}
                error={formik.touched.carYear && formik.errors.carYear}
                required
            />

            <TextInput
                label="Przebieg (km)"
                name="carMileage"
                type="number"
                value={formik.values.carMileage}
                onChange={formik.handleChange}
                error={formik.touched.carMileage && formik.errors.carMileage ? formik.errors.carMileage : undefined}
                required
            />
            <Select
                label="Typ silnika"
                name="carEngineType"
                value={formik.values.carEngineType}
                onChange={(value) => formik.setFieldValue('carEngineType', value)}
                onBlur={formik.handleBlur}
                data={engineTypes}
                error={formik.touched.carEngineType && formik.errors.carEngineType}
                required
            />
            <TextInput
                label="Pojemność silnika (cm³)"
                name="carEngineSize"
                type="number"
                value={formik.values.carEngineSize}
                onChange={formik.handleChange}
                error={formik.touched.carEngineSize && formik.errors.carEngineSize ? formik.errors.carEngineSize : undefined}
                required
            />

            <TextInput
                label="Cena (PLN)"
                name="carPrice"
                type="number"
                value={formik.values.carPrice}
                onChange={formik.handleChange}
                error={formik.touched.carPrice && formik.errors.carPrice ? formik.errors.carPrice : undefined}
                required
            />
            <Group mt="md">
                <Button type="submit">Dodaj ogłoszenie</Button>
            </Group>
            {isSubmittedSuccessfully && (
                <div className="success-message">
                    Ogłoszenie zostało pomyślnie dodane!
                </div>
            )}
        </form>
        );
};
