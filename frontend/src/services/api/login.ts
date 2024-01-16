// src/services/loginService.ts
const API_URL = "http://localhost:8080/api/login"; // Zmień na odpowiedni URL backendu

interface LoginData {
    email: string;
    password: string;
}

const loginUser = async (data: LoginData): Promise<any> => {
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

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error during user login:', error);
        throw error;
    }
};

export default loginUser;
