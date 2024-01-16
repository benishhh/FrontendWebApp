import {bool} from "yup";

export interface brandResponse {
    success: boolean;
    data: {
        brands: [{
            _id: string,
            name: string,
            carModels: string[]
        }]
    }
}



const API_URL = 'http://localhost:8080/api/brands';

const getBrands = async (): Promise<brandResponse> => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Nie udało się pobrać marek samochodów');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }
};

export { getBrands };