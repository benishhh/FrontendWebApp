import {bool} from "yup";
interface  brand {
    _id: string,
    name: string,
    carModels: string[]
}
export interface brandResponse {
    success: boolean;
    data: {
        brands: brand[]
    }
}


const API_URL = 'http://localhost:8080/api/brands';

const getBrands = async (): Promise<brandResponse> => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Nie udało się pobrać marek samochodów');
        }
        console.log(response);

        return await response.json();
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }
};




export { getBrands };