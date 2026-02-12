import mongoose from 'mongoose';

const folderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    }
}, {
    timestamps: true
});

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;
