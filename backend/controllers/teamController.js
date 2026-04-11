const Team = require('../models/Team');
const User = require('../models/User');
const { sendInviteEmail } = require('../utils/emailService');

// 1. CREATE A TEAM
const createTeam = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const newTeam = await Team.create({
            name,
            description,
            owner: req.user._id, // You are the owner!
            members: [{
                user: req.user._id, // You are automatically the first member
                role: 'Admin'
            }]
        });

        res.status(201).json({ success: true, data: newTeam });
    } catch (error) {
        next(error);
    }
};

// 2. GET MY TEAMS
const getTeams = async (req, res, next) => {
    try {
        // Find teams where the user is either the Owner OR inside the members array
        const teams = await Team.find({
            $or: [
                { owner: req.user._id },
                { 'members.user': req.user._id }
            ]
        }).populate('owner', 'name email') // Convert the boring IDs into real user names!
            .populate('members.user', 'name email color');

        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};

// 3. INVITE A MEMBER TO THE TEAM
const inviteMember = async (req, res, next) => {
    try {
        const { teamId, email, name, role } = req.body;

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });

        // 1. Check if the user already has an account
        let user = await User.findOne({ email });

        // 2. CV MAGIC: Auto-register dummy account if it doesn't exist
        if (!user) {
            user = await User.create({
                name: name || "New Teammate",
                email: email,
                password: "password123", // They can log in with this later
                role: role || "Member"
            });
        }

        // 3. Add to team (prevent duplicates)
        const alreadyInTeam = team.members.find(m => m.user.toString() === user._id.toString());
        if (!alreadyInTeam) {
            team.members.push({ user: user._id, role: role || 'Member' });
            await team.save();
        }

        // 4. Send Email via Ethereal 
        await sendInviteEmail(email, team.name, "http://localhost:5173/login");

        // 5. Send updated team back to UI
        const updatedTeam = await Team.findById(teamId)
            .populate('owner', 'name email')
            .populate('members.user', 'name email color');

        res.status(200).json({ success: true, data: updatedTeam });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTeam, getTeams, inviteMember };
