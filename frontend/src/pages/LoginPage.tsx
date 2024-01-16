import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core';
import {useNavigate} from "react-router-dom";
import loginUser from "../services/api/login";

// Schemat walidacji dla formularza logowania
const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export const LoginPage = () => {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        //localstorage wersja
        // onSubmit: (values) => {
        //     const storedData = localStorage.getItem('userData');
        //     const userData = storedData ? JSON.parse(storedData) : null;
        //
        //     if (userData && values.email === userData.email && values.password === userData.password) {
        //         // Zapisanie, że użytkownik jest zalogowany
        //         localStorage.setItem('isLoggedIn', 'true');
        //         navigate('/moto/profile'); // Przekierowanie do strony profilu
        //     } else {
        //         alert('Nieprawidłowy email lub hasło');
        //     }
        // },
        onSubmit: async (values) => {
            try {
                const response = await loginUser(values);
                // Zapisanie tokena JWT
                sessionStorage.setItem('authToken', response.data.token);
                navigate('/moto/profile'); // Przekierowanie do strony profilu
            } catch (error) {
                alert('Nieprawidłowy email lub hasło');
            }
        },

    });

    return (
        <Container size={420} my={40}>
            <Title style={{ textAlign: 'center' }} mb={12}>
                Logowanie
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius={15}>
                <form onSubmit={formik.handleSubmit}>
                    <TextInput
                        label="Email"
                        placeholder="Your email"
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && formik.errors.email}
                        mb={12}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && formik.errors.password}
                        mb={12}
                    />

                    <Button fullWidth mt="xl" type="submit">
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};
