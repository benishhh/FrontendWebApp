import {RouteObject, useRoutes} from "react-router-dom";
import {Layout} from "../components/Layout";
import {CarListPage} from "../pages/CarListPage";
import React from "react";
import {ListingAddNew} from "../pages/ListingAddNew";
import {ErrorPage} from "../pages/ErrorPage";
import {LoginPage} from "../pages/LoginPage";
import {ProfilePage} from "../pages/ProfilePage";
import {RegisterPage} from "../pages/RegisterPage";
import {SettingsPage} from "../pages/SettingsPage";
import {CarDetailsPage} from "../pages/CarDetailsPage";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            //
            {
                path: '/moto/search',
                element: <CarListPage/>
            },
            {
                path: '/moto/addnew',
                element: <ListingAddNew/>
            },
            // {
            //     path: '/moto/:id',
            //     element: <ListingAddNew/>
            // },
            {
                path: '/moto/login',
                element: <LoginPage/>
            },
            {
                path: '/moto/register',
                element: <RegisterPage/>
            },
            {
                path: '/moto/profile',
                element: <ProfilePage/>
            },
            {
                path: '/moto/settings',
                element: <SettingsPage/>
            },
            {
                path: '/moto/car/:carId',
                element: <CarDetailsPage/>
            },
            {
                path: '*',
                element: <ErrorPage/>
            }
        ]
    }
]

export const Routing = () => {
    return useRoutes(routes);
}