import mongoose, { Document, Schema } from 'mongoose';


interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    listings: mongoose.Types.ObjectId[];
    liked: mongoose.Types.ObjectId[];
    themeMode: 'light' | 'dark';
}

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    listings: [{ type: mongoose.Schema.ObjectId, ref: 'Listing' }],
    liked: [{ type: mongoose.Schema.ObjectId, ref: 'Listing' }],
    themeMode: { type: String, enum: ['light', 'dark'], default: 'light' },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
