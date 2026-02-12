import mongoose from 'mongoose';

const activitySchema = mongoose.Schema({
    teamOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['member_add', 'member_remove', 'update', 'task_create', 'task_update', 'task_delete', 'task_complete', 'task_reassign', 'task_status_change'],
        default: 'update'
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
