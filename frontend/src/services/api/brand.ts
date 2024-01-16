export interface Brand {
    name: string;
    carModels: string[];
}

const API_URL = 'http://localhost:8080/api/brands'; // Zaktualizuj URL w razie potrzeby

const getBrands = async (): Promise<Brand[]> => {
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