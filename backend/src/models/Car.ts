import mongoose, { Document, Schema } from 'mongoose';

type EngineType = "diesel" | "gasoline" | "electric" | "hybrid";

interface ICar extends Document {
    brand: mongoose.Types.ObjectId;
    carModel: string
    year: number;
    mileage: number;
    engineType: EngineType;
    engineSize: number;
    price: number;
    specifications: string;
    description: string;
}

const carSchema: Schema<ICar> = new Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    carModel: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    engineType: { type: String, enum: ["diesel", "gasoline", "electric", "hybrid"], required: true },
    engineSize: { type: Number, required: true },
    price: { type: Number, required: true },
    specifications: { type: String, required: true },
    description: { type: String, required: true },
});

const Car = mongoose.model<ICar>('Car', carSchema);

export default Car;
