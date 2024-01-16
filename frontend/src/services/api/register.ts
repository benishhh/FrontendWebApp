// src/services/userService.ts
const API_URL = "http://localhost:8080/api/register"; // Zmień na odpowiedni URL backendu

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during user registration:', error);
        throw error;
    }
};

export default {
    registerUser,
};
