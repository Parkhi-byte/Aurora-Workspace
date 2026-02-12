import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['text', 'image', 'file'],
            default: 'text',
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
