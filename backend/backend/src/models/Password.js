import mongoose from 'mongoose';

const passwordSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        url: {
            type: String,
        },
        category: {
            type: String,
            default: 'login', // login, meeting, website, other
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Password = mongoose.model('Password', passwordSchema);

export default Password;
