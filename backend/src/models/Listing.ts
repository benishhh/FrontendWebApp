import mongoose, { Document, Schema } from 'mongoose';

interface IListing extends Document {
    title: string;
    description: string;
    price: number;
    car: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    likedByUsers: mongoose.Types.ObjectId[];
}

const listingSchema: Schema<IListing> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    car: { type: mongoose.Schema.ObjectId, ref: 'Car', required: true},
    seller: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    likedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Listing = mongoose.model<IListing>('Listing', listingSchema);
export default Listing;
