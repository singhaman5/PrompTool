const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a team name'],
        trim: true
    },
    description: {
        type: String,
        default: 'A workspace team'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            default: 'Member' // Custom role inside THIS specific team
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', TeamSchema);
