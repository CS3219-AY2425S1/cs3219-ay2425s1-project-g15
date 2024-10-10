import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export enum UserRole { ADMIN = 'ADMIN', USER = 'USER' }

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    username: {
        type: String
    },
    linkedInUrl: {
        type: String
    },
    gitHubUrl: {
        type: String
    },
    authorisationRole: {
        type: String,
        enum: [UserRole.ADMIN, UserRole.USER],
        default: UserRole.USER,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLoggedIn: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model('User', userSchema);

export default userModel;