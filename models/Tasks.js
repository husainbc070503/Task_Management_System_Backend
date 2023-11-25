const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    dueDate: {
        type: Date,
        default: Date.now(),
    },

    status: {
        type: String,
        required: true,
    }

}, { timestamps: true });

const Task = mongoose.model('task', TaskSchema);
module.exports = Task;