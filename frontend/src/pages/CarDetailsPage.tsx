import React from 'react';
import {useParams} from "react-router-dom";
import {mockCars} from "../data/mockData";


export const CarDetailsPage = () => {
    const { carId } = useParams();
    const car = mockCars.find(car => car.id.toString() === carId);

    if (!car) {
        return <p>Ogłoszenie nie znalezione.</p>;
    }

    return (
        <div>
            <h1>{car.title}</h1>
            <p>{car.description}</p>
            {/* Tutaj dodatkowe informacje o samochodzie */}
        </div>
    );
};